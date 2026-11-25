import 'prismjs/themes/prism-okaidia.css';
import '../../styles/global.css';

import type { Metadata, Viewport } from 'next';
import React from 'react';

import { Footer } from '../../components/footer';
import { NavMenu } from '../../components/nav-menu';
import { SITE } from '../../lib/site';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Swaps broken images for their `data-fallback` (once). Capture phase: error events don't bubble.
const imageFallbackScript = `document.addEventListener('error',function(e){var i=e.target;if(!i||i.tagName!=='IMG')return;var f=i.getAttribute('data-fallback');if(!f||i.dataset.fallbackApplied)return;i.dataset.fallbackApplied='true';i.src=f;},true);`;

const gtmScript = (id: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(id)});`;

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
