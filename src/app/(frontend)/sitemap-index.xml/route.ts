import { sitemapIndexResponse } from '@/lib/sitemap';

// Built once; revalidated with the rest of the site (lib/revalidate.ts).
export const dynamic = 'force-static';

export function GET() {
  return sitemapIndexResponse();
}
