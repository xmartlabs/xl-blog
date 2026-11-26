import type { Payload } from 'payload';

/**
 * Creates the first admin from FIRST_ADMIN_EMAIL, only while the users collection is empty.
 *
 * - Password login on (default): a break-glass admin with FIRST_ADMIN_PASSWORD.
 * - Password login off (DISABLE_PASSWORD_LOGIN): an admin without a password; that person
 *   becomes admin by signing in with Google with that address (sign-in matches users by email).
 */
export async function seedFirstAdmin(
  payload: Payload,
  { passwordLogin = true }: { passwordLogin?: boolean } = {}
) {
  const email = process.env.FIRST_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.FIRST_ADMIN_PASSWORD;
  if (!email || (passwordLogin && !password)) return;

  const { totalDocs } = await payload.count({ collection: 'users' });
  if (totalDocs > 0) return;

  await payload.create({
    collection: 'users',
    data: passwordLogin
      ? { email, password, name: 'Admin', roles: ['admin'] }
      : { email, name: 'Admin', roles: ['admin'] },
  });
  payload.logger.info(
    passwordLogin
      ? `Created the first admin user (${email}).`
      : `Created the first admin user (${email}); password login is off, so sign in with Google as ${email}.`
  );
}
