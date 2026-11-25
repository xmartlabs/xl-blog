import readingTime from 'reading-time';

import { lexicalToHTML } from '../components/rich-text/to-html';
import type { Post } from '../payload-types';

/**
 * The post body as HTML plus its reading time. Runs on the server only: code highlighting
 * loads Prism grammars from disk.
 */
export function renderPostBody(
  post: Pick<Post, 'content' | 'legacyReadingTime'>
) {
  const bodyHtml = lexicalToHTML(post.content as never);
  // Imported posts keep the old value (measured on the Markdown source); new or edited posts
  // measure the rendered text.
  const timeToRead =
    post.legacyReadingTime ||
    readingTime(bodyHtml.replace(/<[^>]+>/g, ' ')).text;
  return { bodyHtml, timeToRead };
}
