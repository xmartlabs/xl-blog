import React from 'react';

import { XmartlabsLogo } from '../icons/xmartlabs-logo/xmartlabs-logo';

/**
 * Square Xmartlabs mark in the admin nav. Registered as `admin.components.graphics.Icon`.
 * Payload draws it in a fixed box (18px, 16px on small screens), so it fills that box instead of
 * using its own size; a bigger fixed size was clipped.
 */
export const Icon = () => (
  <XmartlabsLogo
    width="100%"
    height="100%"
    style={{ display: 'block' }}
    role="img"
    aria-label="Xmartlabs"
  />
);
