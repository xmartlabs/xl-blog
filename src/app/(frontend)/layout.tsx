import 'prismjs/themes/prism-okaidia.css';
import '../../styles/global.css';

import type { Viewport } from 'next';
import React from 'react';

import { SiteDocument } from '../../components/site-document/SiteDocument';

// No `metadata` export: every page renders <Seo> (title, description, Open Graph, canonical),
// so Next must not add a second <title>/description.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteDocument>{children}</SiteDocument>;
}
