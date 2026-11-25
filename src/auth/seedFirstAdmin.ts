import type { Payload } from 'payload';

/**
 * Creates the break-glass admin (password login) from FIRST_ADMIN_EMAIL / FIRST_ADMIN_PASSWORD,
 * only while the users collection is empty. Everyone else signs in with Google.
 */
export async function seedFirstAdmin(payload: Payload) {
  const email = process.env.FIRST_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.FIRST_ADMIN_PASSWORD;
  if (!email || !password) return;

  const { totalDocs } = await payload.count({ collection: 'users' });
  if (totalDocs > 0) return;

  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Admin', roles: ['admin'] },
  });
  payload.logger.info(`Created the first admin user (${email}).`);
}
