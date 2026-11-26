import { describe, expect, it } from 'vitest';

import {
  emailAdapter,
  getEmailSettings,
  parseEmailFrom,
} from '../src/lib/email';

describe('parseEmailFrom', () => {
  it.each([
    [
      'Xmartlabs Blog <blog@xmartlabs.com>',
      { name: 'Xmartlabs Blog', address: 'blog@xmartlabs.com' },
    ],
    [
      '"Xmartlabs Blog" <blog@xmartlabs.com>',
      { name: 'Xmartlabs Blog', address: 'blog@xmartlabs.com' },
    ],
    [
      '  blog@xmartlabs.com ',
      { name: 'Xmartlabs Blog', address: 'blog@xmartlabs.com' },
    ],
    [
      '<blog@xmartlabs.com>',
      { name: 'Xmartlabs Blog', address: 'blog@xmartlabs.com' },
    ],
  ])('parses %j', (input, expected) => {
    expect(parseEmailFrom(input)).toEqual(expected);
  });

  it.each([
    [undefined],
    [''],
    ['Xmartlabs Blog'],
    ['blog@'],
    ['Name <not an address>'],
    ['a@b'],
  ])('rejects %j', (input) => {
    expect(parseEmailFrom(input)).toBeNull();
  });
});

describe('getEmailSettings', () => {
  it('is off (console logging) without RESEND_API_KEY', () => {
    expect(getEmailSettings({})).toEqual({ enabled: false });
    expect(getEmailSettings({ EMAIL_FROM: 'a@b.co' })).toEqual({
      enabled: false,
    });
    expect(emailAdapter(getEmailSettings({}))).toBeUndefined();
  });

  it('is off, with a warning, when EMAIL_FROM is missing or malformed', () => {
    for (const EMAIL_FROM of [undefined, '', 'nope']) {
      const settings = getEmailSettings({ RESEND_API_KEY: 're_x', EMAIL_FROM });
      expect(settings.enabled).toBe(false);
      expect(settings).toHaveProperty('warning');
      expect(emailAdapter(settings)).toBeUndefined();
    }
  });

  it('uses Resend with both set', () => {
    const settings = getEmailSettings({
      RESEND_API_KEY: ' re_test_key ',
      EMAIL_FROM: 'Xmartlabs Blog <blog@xmartlabs.com>',
    });
    expect(settings).toEqual({
      enabled: true,
      apiKey: 're_test_key',
      defaultFromAddress: 'blog@xmartlabs.com',
      defaultFromName: 'Xmartlabs Blog',
    });
    expect(typeof emailAdapter(settings)).toBe('function');
  });
});
