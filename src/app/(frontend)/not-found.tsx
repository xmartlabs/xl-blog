import { NotFoundContent } from '@/components/not-found/NotFoundContent';

/**
 * The frontend's not-found boundary. Pages return <NotFoundPage /> for unknown params (it
 * server-renders NotFoundContent with a 404 status, see components/not-found/NotFoundPage.tsx);
 * on the client its notFound() lands here and shows the same component. A plain notFound()
 * (draft mode) also ends here, but Next 16 then sends an error shell and renders this on the
 * client. URLs that match no route at all get app/global-not-found.tsx.
 */
export default NotFoundContent;
