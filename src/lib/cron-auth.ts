import crypto from 'node:crypto';

import type { PayloadRequest } from 'payload';

import { isAdminUser } from '../access';

/**
 * True when the request carries `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends it when
 * CRON_SECRET is set). Fails closed when the secret isn't configured. Constant-time compare.
 */
export function hasCronSecret(
  authorization: string | null | undefined,
  secret: string | undefined = process.env.CRON_SECRET
): boolean {
  if (!secret || !authorization) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(authorization);
  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
}

/**
 * Who may run the jobs queue (/api/payload-jobs/run, scheduled publishing): signed-in admins,
 * and Vercel Cron with `Authorization: Bearer $CRON_SECRET`.
 */
export const canRunJobs = ({
  req,
}: {
  req: Pick<PayloadRequest, 'user' | 'headers'>;
}): boolean =>
  isAdminUser(req.user) || hasCronSecret(req.headers.get('authorization'));
