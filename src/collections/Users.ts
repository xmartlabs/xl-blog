import { Forbidden } from 'payload';
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';

import {
  admins,
  adminsField,
  adminsOrSelf,
  authenticated,
  isAdminUser,
} from '../access';

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
    defaultColumns: ['email', 'name', 'roles'],
  },
  auth: {
    // Server-side sessions: logging out or deleting a user revokes its tokens.
    useSessions: true,
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  hooks: {
    beforeChange: [editorsKeepGoogleIdentity],
  },
  access: {
    // Any signed-in user can use the admin panel.
    admin: ({ req: { user } }) => Boolean(user),
    // Accounts are created by Google sign-in (or by an admin), never by self sign-up.
    create: admins,
    read: authenticated,
    update: adminsOrSelf,
    delete: admins,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
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
      },
    },
  ],
};
