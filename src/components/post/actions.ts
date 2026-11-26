'use server';

import { headers } from 'next/headers';

import { getPayloadClient } from '../../lib/payload';
import { renderPostBody } from '../../lib/post-body';
import type { Post } from '../../payload-types';

/**
 * Live preview: renders the body of the post being edited with the exact production renderer
 * (Prism grammars are loaded on the server). Signed-in users only.
 */
export async function renderPreviewBody(
  post: Pick<Post, 'content' | 'legacyReadingTime'>
) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) throw new Error('Unauthorized');
  return renderPostBody(post);
}
