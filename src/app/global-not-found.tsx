import 'prismjs/themes/prism-okaidia.css';
import '../styles/global.css';

import type { Viewport } from 'next';
import React from 'react';

import { NotFoundContent } from '../components/not-found/NotFoundContent';
import { SiteDocument } from '../components/site-document/SiteDocument';

/**
 * The 404 page for URLs that match no route (`experimental.globalNotFound`). The app has two
 * root layouts (frontend and Payload), so this file renders the whole site document itself.
 * notFound() calls inside frontend pages use (frontend)/not-found.tsx.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function GlobalNotFound() {
  return (
    <SiteDocument>
      <NotFoundContent />
    </SiteDocument>
  );
}
