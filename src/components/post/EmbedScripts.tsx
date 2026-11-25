'use client';

import { useEffect } from 'react';

import { externalScriptSources } from './embed-scripts';

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: Element | null) => void } };
    instgrm?: { Embeds?: { process: () => void } };
  }
}

/**
 * Runs the external scripts of HTML embeds in the post body (e.g. Twitter's widgets.js).
 *
 * The body is injected as an HTML string, and `<script>` elements inserted that way never
 * run when React (re)renders them on the client: in live preview, or if the body is ever
 * rendered after a client-side navigation. So each script source is loaded once by appending
 * a real `<script>`; embed scripts are written to be included many times (every tweet embed
 * carries the same tag), so a duplicate from the server HTML is harmless. When the body
 * changes (live preview), the widgets are asked to process the new markup.
 */
export function EmbedScripts({ html }: { html: string }) {
  useEffect(() => {
    for (const src of new Set(externalScriptSources(html))) {
      if (document.querySelector(`script[data-embed-src="${CSS.escape(src)}"]`))
        continue;
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.dataset.embedSrc = src;
      document.body.appendChild(script);
    }
    window.twttr?.widgets?.load(document.querySelector('.bodyPostContainer'));
    window.instgrm?.Embeds?.process();
  }, [html]);
  return null;
}
