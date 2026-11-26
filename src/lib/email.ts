import { resendAdapter } from '@payloadcms/email-resend';
import type { EmailAdapter } from 'payload';

/**
 * Outgoing email (password-reset links for password users; Google users never get any).
 *
 * Optional and off by default: without RESEND_API_KEY, Payload logs emails to the console
 * instead of sending them (its built-in behavior). With RESEND_API_KEY and EMAIL_FROM
 * (`Name <address>` or a bare address, on a domain verified in Resend), emails go through
 * Resend's API.
 */

export type EmailSettings =
  | {
      enabled: true;
      apiKey: string;
      defaultFromAddress: string;
      defaultFromName: string;
    }
  | { enabled: false; warning?: string };

const DEFAULT_FROM_NAME = 'Xmartlabs Blog';
const ADDRESS = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

/** `Name <a@b.c>` or `a@b.c` → name and address; null when malformed. */
export function parseEmailFrom(
  value: string | undefined
): { name: string; address: string } | null {
  const from = value?.trim();
  if (!from) return null;
  const named = from.match(/^(.*?)\s*<([^<>]+)>$/);
  const name = named ? named[1].trim().replace(/^"(.*)"$/, '$1') : '';
  const address = (named ? named[2] : from).trim();
  if (!ADDRESS.test(address)) return null;
  return { name: name || DEFAULT_FROM_NAME, address };
}

export function getEmailSettings(
  env: Record<string, string | undefined> = process.env
): EmailSettings {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) return { enabled: false };
  const from = parseEmailFrom(env.EMAIL_FROM);
  if (!from) {
    return {
      enabled: false,
      warning:
        'RESEND_API_KEY is set but EMAIL_FROM is missing or not "Name <address>": emails are only logged to the console.',
    };
  }
  return {
    enabled: true,
    apiKey,
    defaultFromAddress: from.address,
    defaultFromName: from.name,
  };
}

/** The Payload `email` option: the Resend adapter, or undefined (console logging). */
export function emailAdapter(
  settings: EmailSettings
): EmailAdapter | undefined {
  if (!settings.enabled) return undefined;
  return resendAdapter({
    apiKey: settings.apiKey,
    defaultFromAddress: settings.defaultFromAddress,
    defaultFromName: settings.defaultFromName,
  });
}
