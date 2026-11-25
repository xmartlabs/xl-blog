import { NotFoundContent } from '@/components/not-found/NotFoundContent';

/**
 * notFound() in a frontend page (unknown post, category, tag, author or page number): 404
 * status. Next 16 sends an error shell for these and renders this component on the client
 * once the page loads. URLs that match no route at all get app/global-not-found.tsx, which is
 * fully server-rendered.
 */
export default NotFoundContent;
