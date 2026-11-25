import type { SerializedEditorState } from 'lexical';
import React from 'react';

import { lexicalToHTML } from './to-html';

/**
 * A post body: `<div class="bodyPostContainer">` with the Lexical content rendered to an HTML
 * string (see ./to-html.ts for why a string and not JSX converters: every block, including
 * legacy raw HTML, must be a direct child of the container, exactly like the old markup).
 */
export function RichText({
  data,
  className = 'bodyPostContainer',
}: {
  data: SerializedEditorState | null | undefined;
  className?: string;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: lexicalToHTML(data) }}
    />
  );
}
