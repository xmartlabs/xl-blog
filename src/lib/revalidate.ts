import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from 'payload';

/**
 * On-demand revalidation of the statically generated frontend.
 *
 * A post change can affect nearly every public page: its own page, the home and category
 * lists (and their pagination), tag and author pages, the "more blogs" cards of other posts in
 * its category, and the sitemap. Authors and categories show up in all of those too. So any
 * change that touches published content revalidates the whole frontend layout plus the
 * sitemap route handlers; pages are then regenerated lazily on their next request.
 *
 * Draft-only saves (including autosave) never change public pages and are skipped.
 *
 * Outside a Next.js request (the content migration script, `payload run`, tests) there is no
 * cache to revalidate and `revalidatePath` throws; that is ignored. Callers can also skip it
 * explicitly with `context: { disableRevalidate: true }`.
 */
export async function revalidateFrontend(req: PayloadRequest, reason: string) {
  if (req.context?.disableRevalidate || req.context?.legacyImport) return;
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');
    revalidatePath('/sitemap-index.xml');
    revalidatePath('/sitemap-0.xml');
    req.payload.logger.info(`Revalidated the frontend (${reason})`);
  } catch (error) {
    req.payload.logger.debug(
      { err: error },
      `Skipped revalidation outside Next.js (${reason})`
    );
  }
}

type Versioned = { _status?: 'draft' | 'published' | null; slug?: string };

const isPublished = (doc: unknown) =>
  (doc as Versioned | undefined)?._status === 'published';

/** Posts: revalidate when the published version changes (publish, update, unpublish). */
export const revalidatePostAfterChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (isPublished(doc)) {
    await revalidateFrontend(req, `post ${(doc as Versioned).slug}`);
    return doc;
  }
  // A draft. Draft saves (Save draft, autosave: `?draft=true`) never touch the published
  // version. Any other update that leaves the post as a draft is an unpublish (manual or
  // scheduled). previousDoc can't tell: it may be the latest draft, not the published version.
  const isDraftSave = String(req.query?.draft) === 'true';
  if (!isDraftSave && operation === 'update') {
    await revalidateFrontend(
      req,
      `unpublished post ${(doc as Versioned).slug}`
    );
  }
  return doc;
};

/** Authors, categories: always shown on public pages. */
export const revalidateAfterChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  req,
}) => {
  await revalidateFrontend(req, `${collection.slug} ${doc.id}`);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({
  collection,
  doc,
  req,
}) => {
  if (collection.slug !== 'posts' || isPublished(doc)) {
    await revalidateFrontend(req, `deleted ${collection.slug} ${doc.id}`);
  }
  return doc;
};
