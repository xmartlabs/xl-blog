import { Forbidden } from 'payload';
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';

import {
  admins,
  adminsField,
  adminsOrSelf,
  authenticated,
  isAdminUser,
} from '../access';
import { LOCK_TIME_MS, MAX_LOGIN_ATTEMPTS } from '../auth/password-login';

/**
 * Editors sign in with Google only: they can't give themselves a password or change their
 * email (the Google identity). Admins can, e.g. for the break-glass account.
 */
const editorsKeepGoogleIdentity: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== 'update' || !req.user || isAdminUser(req.user)) return data;
  const changesEmail =
    typeof data.email === 'string' &&
    data.email.toLowerCase() !== String(originalDoc?.email ?? '').toLowerCase();
  if (data.password || changesEmail) throw new Forbidden(req.t);
  return data;
};

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'roles', 'author'],
    listSearchableFields: ['email', 'name'],
    description:
      'People who can sign in. A user is created on their first Google sign-in, as an editor.',
  },
  auth: {
    // Server-side sessions: logging out or deleting a user revokes its tokens.
    useSessions: true,
    tokenExpiration: 60 * 60 * 24 * 7,
    // Password login (the break-glass admin): lock the account after 5 wrong passwords for
    // 10 minutes. DISABLE_PASSWORD_LOGIN turns password login off (payload.config.ts).
    maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
    lockTime: LOCK_TIME_MS,
  },
  hooks: {
    beforeChange: [editorsKeepGoogleIdentity],
  },
  access: {
    // Any signed-in user can use the admin panel.
    admin: ({ req: { user } }) => Boolean(user),
    // Accounts are created by Google sign-in (or by an admin), never by self sign-up.
    create: admins,
    // Editors see the other users too: the "<user> is editing this post" lock notice needs it.
    read: authenticated,
    update: adminsOrSelf,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Filled from the Google account on the first sign-in.',
      },
    },
    {
      // Not linked automatically on Google sign-in (an author with the same name may be a
      // different person); admins set it. New posts preselect this author.
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      access: {
        create: adminsField,
        update: adminsField,
      },
      admin: {
        position: 'sidebar',
        description:
          'This person’s author profile: new posts they create preselect it. Set by admins.',
      },
    },
    {
      // Google account id, set by Google sign-in. Declared here (payload-oauth2 adds it only
      // when Google is enabled) so the database schema doesn't depend on env vars.
      name: 'sub',
      type: 'text',
      index: true,
      access: { update: () => false },
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Google account id',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only admins can promote or demote users.
        create: adminsField,
        update: adminsField,
      },
      admin: {
        position: 'sidebar',
        description:
          'Editors write, publish and schedule posts. Admins can also manage users and roles, categories, and delete content.',
      },
    },
  ],
};
