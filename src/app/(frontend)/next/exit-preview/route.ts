import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

/** GET /next/exit-preview?path=/blog/<slug>/ turns draft mode off. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const path = request.nextUrl.searchParams.get('path') ?? '/';
  const safe =
    path.startsWith('/') && !path.startsWith('//') && !path.includes('\\');
  redirect(safe ? path : '/');
}
