import type { CollectionConfig } from 'payload';

/** Wrong passwords before an account is locked, and for how long. */
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_TIME_MS = 10 * 60 * 1000;

/**
 * Login token lifetime (seconds) when password login is off. In that mode payload-oauth2 doesn't
 * use Payload's server-side sessions, so signing out can't revoke a token: keep it short-lived.
 */
export const GOOGLE_ONLY_TOKEN_EXPIRATION = 8 * 60 * 60;

export interface PasswordLoginDecision {
  /** False when DISABLE_PASSWORD_LOGIN=true and Google sign-in is configured. */
  enabled: boolean;
  /** Set when the switch was ignored (logged on startup). */
  warning?: string;
}

const isTrue = (value: string | undefined) =>
  ['true', '1', 'yes'].includes(value?.trim().toLowerCase() ?? '');

/**
 * Email + password login (the break-glass admin) is on unless DISABLE_PASSWORD_LOGIN=true.
 * The switch only takes effect when Google sign-in is configured: otherwise nobody could sign
 * in at all, so password login stays on and a warning is logged.
 */
export function decidePasswordLogin(
  env: Record<string, string | undefined>,
  googleEnabled: boolean
): PasswordLoginDecision {
  if (!isTrue(env.DISABLE_PASSWORD_LOGIN)) return { enabled: true };
  if (!googleEnabled) {
    return {
      enabled: true,
      warning:
        'DISABLE_PASSWORD_LOGIN is set but Google sign-in is not configured; keeping password login so admins are not locked out.',
    };
  }
  return { enabled: false };
}

/**
 * Applies the decision to the users collection. With password login off, the local strategy is
 * disabled but its fields are kept (`enableFields`), so the database schema and the generated
 * types are the same either way and the switch can be flipped without a migration.
 */
export function withPasswordLogin(
  collection: CollectionConfig,
  decision: PasswordLoginDecision
): CollectionConfig {
  if (decision.enabled) return collection;
  const auth = typeof collection.auth === 'object' ? collection.auth : {};
  return {
    ...collection,
    auth: {
      ...auth,
      disableLocalStrategy: { enableFields: true },
      tokenExpiration: Math.min(
        auth.tokenExpiration ?? GOOGLE_ONLY_TOKEN_EXPIRATION,
        GOOGLE_ONLY_TOKEN_EXPIRATION
      ),
    },
  };
}
