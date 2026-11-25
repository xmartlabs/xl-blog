import React from 'react';

import { Footer } from '../footer';
import { NavMenu } from '../nav-menu';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

// Swaps broken images for their `data-fallback` (once). Capture phase: error events don't bubble.
const imageFallbackScript = `document.addEventListener('error',function(e){var i=e.target;if(!i||i.tagName!=='IMG')return;var f=i.getAttribute('data-fallback');if(!f||i.dataset.fallbackApplied)return;i.dataset.fallbackApplied='true';i.src=f;},true);`;

const gtmScript = (id: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(id)});`;

/**
 * The site's <html> document: head tags shared by every page, GTM, nav menu and footer.
 * Used by the frontend root layout and by app/global-not-found.tsx (which bypasses layouts).
 *
 * Title, description, Open Graph, Twitter and canonical tags come from <Seo> in each page
 * (components/seo/Seo.tsx); React hoists them into <head>.
 */
export function SiteDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="sitemap" type="application/xml" href="/sitemap-index.xml" />
        {gtmId && (
          <script dangerouslySetInnerHTML={{ __html: gtmScript(gtmId) }} />
        )}
        <script dangerouslySetInnerHTML={{ __html: imageFallbackScript }} />
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              aria-hidden="true"
            />
          </noscript>
        )}
        <NavMenu />
        {children}
        <Footer />
      </body>
    </html>
  );
}
