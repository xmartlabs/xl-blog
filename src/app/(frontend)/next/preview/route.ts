import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { getPayloadClient } from '@/lib/payload';

/**
 * GET /next/preview?path=/blog/<slug>/
 *
 * Used by the admin panel's Preview button and live preview (see collections/Posts.ts).
 * Turns on Next.js draft mode, so the post page reads the latest draft, and redirects to
 * `path`. Only for signed-in Payload users; the post page checks the session again.
 */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') ?? '/';
  // Same-site paths only (no `//host` or `/\host` open redirects).
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return new Response('Invalid path', { status: 400 });
  }

  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    (await draftMode()).disable();
    return new Response('Sign in to the admin panel to preview drafts.', {
      status: 403,
    });
  }

  (await draftMode()).enable();
  redirect(path);
}
