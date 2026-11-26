import type { Access, FieldAccess, PayloadRequest } from 'payload';

type MaybeUser = PayloadRequest['user'];

export const hasRole = (user: MaybeUser, role: 'admin' | 'editor') =>
  Boolean(
    user &&
    'roles' in user &&
    Array.isArray(user.roles) &&
    user.roles.includes(role)
  );

export const isAdminUser = (user: MaybeUser) => hasRole(user, 'admin');

/** Any signed-in user (editors and admins). */
export const authenticated: Access = ({ req: { user } }) => Boolean(user);

export const admins: Access = ({ req: { user } }) => isAdminUser(user);

export const adminsField: FieldAccess = ({ req: { user } }) =>
  isAdminUser(user);

export const anyone: Access = () => true;

/** Admins can touch any user; everyone else only themselves. */
export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (isAdminUser(user)) return true;
  return { id: { equals: user.id } };
};

/** Signed-in users see drafts; the public only sees published documents. */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: 'published' } };
};
