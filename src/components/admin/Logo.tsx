import React from 'react';

import { XmartlabsTextLogoWhite } from '../icons/xmartlabs-text-logo-white/xmartlabs-text-logo-white';

/**
 * Admin logo (login page and other minimal pages): the Xmartlabs text logo with a pink mark
 * and text in the theme's text color, so it reads in both light and dark mode.
 * Registered as `admin.components.graphics.Logo`.
 */
export const Logo = () => (
  <div className="xl-admin-logo">
    <XmartlabsTextLogoWhite
      color="currentColor"
      markColor="#EE1A64"
      viewBox="0 0 150 44"
      width="225"
      height="66"
      role="img"
      aria-label="Xmartlabs Blog"
    />
    <span className="xl-admin-logo__label">Blog</span>
  </div>
);
