import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { safeInternalPath } from '@/lib/redirects';

/** GET /next/exit-preview?path=/blog/<slug>/ turns draft mode off. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  // Same-site paths only; anything else goes home.
  redirect(safeInternalPath(request.nextUrl.searchParams.get('path'), '/'));
}
