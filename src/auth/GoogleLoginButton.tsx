'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

// Same value as GOOGLE_LOGIN_HREF in ./google (not imported: that module is server-only).
const GOOGLE_LOGIN_HREF = '/api/users/oauth/google';

/**
 * Rendered under the admin login form (admin.components.afterLogin). Renders nothing unless
 * Google sign-in is configured (`enabled`, set in payload.config.ts). A plain link: the endpoint redirects to Google.
 */
export const GoogleLoginButton = ({
  enabled = false,
  allowedDomain = '',
}: {
  enabled?: boolean;
  allowedDomain?: string;
}) => {
  const searchParams = useSearchParams();
  if (!enabled) return null;
  const failed = searchParams.get('error') === 'google';

  return (
    <div style={{ marginTop: 'calc(var(--base) * 1.5)', textAlign: 'center' }}>
      {failed && (
        <p
          role="alert"
          style={{
            color: 'var(--theme-error-500)',
            marginBottom: 'var(--base)',
          }}
        >
          Google sign-in failed.
          {allowedDomain && ` Use your @${allowedDomain} Google account.`}
        </p>
      )}
      <a
        href={GOOGLE_LOGIN_HREF}
        className="btn btn--style-secondary btn--size-large"
        style={{
          display: 'inline-flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        Sign in with Google
      </a>
    </div>
  );
};
