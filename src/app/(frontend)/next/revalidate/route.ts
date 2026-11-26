import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

import { isAdminUser } from '@/access';
import { hasCronSecret } from '@/lib/cron-auth';
import { getPayloadClient } from '@/lib/payload';

/**
 * POST /next/revalidate/ regenerates every public page on its next request.
 *
 * Needed after content is written outside the running site, e.g. the one-time content import
 * (`npm run seed:migrate-content`) right after the first deploy: pages pre-rendered while the
 * database was still empty (home, tags, sitemap) would otherwise stay empty.
 *
 * Allowed for `Authorization: Bearer $CRON_SECRET` or a signed-in admin.
 */
export async function POST(request: NextRequest) {
  let allowed = hasCronSecret(request.headers.get('authorization'));
  if (!allowed) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: request.headers });
    allowed = isAdminUser(user);
  }
  if (!allowed) return new Response('Unauthorized', { status: 401 });

  revalidatePath('/', 'layout');
  revalidatePath('/sitemap-index.xml');
  revalidatePath('/sitemap-0.xml');
  return Response.json({ revalidated: true });
}
