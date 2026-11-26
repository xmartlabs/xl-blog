'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

// Same value as GOOGLE_LOGIN_HREF in ./google (not imported: that module is server-only).
const GOOGLE_LOGIN_HREF = '/api/users/oauth/google';

/** Google's multicolor "G" mark. */
const GoogleMark = () => (
  <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

/**
 * Rendered above the admin login form (admin.components.beforeLogin): the main way in.
 * Renders nothing unless Google sign-in is configured (`enabled`, set in payload.config.ts),
 * in which case the email/password form below becomes the secondary "Admin sign-in"
 * (styles in src/app/(payload)/custom.scss); with `passwordLogin` off Payload hides that form
 * and this button is the only way in. A plain link: the endpoint redirects to Google, and
 * forwards Payload's `?redirect=` (the page the user wanted) so they land back on it; the
 * server sanitizes it.
 */
const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export const GoogleLoginButton = ({
  enabled = false,
  allowedDomain = '',
  passwordLogin = true,
}: {
  enabled?: boolean;
  allowedDomain?: string;
  passwordLogin?: boolean;
}) => {
  const searchParams = useSearchParams();
  // Payload's login page has no <h1>; give screen readers one without changing the look.
  const heading = <h1 style={visuallyHidden}>Sign in to the Xmartlabs Blog</h1>;
  if (!enabled) return heading;
  const failed = searchParams.get('error') === 'google';
  const domain = allowedDomain || 'xmartlabs.com';
  const redirect = searchParams.get('redirect');
  const href = redirect
    ? `${GOOGLE_LOGIN_HREF}?${new URLSearchParams({ redirect })}`
    : GOOGLE_LOGIN_HREF;

  return (
    <div className="xl-google-login">
      {heading}
      {failed && (
        <p role="alert" className="xl-google-login__error">
          <strong>Google sign-in didn&apos;t work.</strong> Only @{domain}{' '}
          Google accounts can sign in. Try again and pick your @{domain}{' '}
          account.
        </p>
      )}
      <a
        href={href}
        className="btn btn--style-primary btn--size-large xl-google-login__button"
      >
        <span className="xl-google-login__mark">
          <GoogleMark />
        </span>
        <span>Sign in with your Xmartlabs Google account</span>
      </a>
      <p className="xl-google-login__hint">
        First time here? Your account is created when you sign in.
      </p>
      {passwordLogin && (
        <>
          <div className="xl-google-login__divider" role="separator">
            <span>Admin sign-in</span>
          </div>
          <p className="xl-google-login__note">
            Email and password, only for the site admin account.
          </p>
        </>
      )}
    </div>
  );
};
