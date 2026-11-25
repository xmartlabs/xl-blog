import crypto from 'node:crypto';

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
