import { describe, expect, it } from 'vitest';

import {
  deploymentKind,
  isNoIndexDeployment,
  robotsConfig,
} from '../src/lib/robots.mjs';

const productionRules = {
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/admin', '/api', '/next/'],
  },
  sitemap: 'https://blog.xmartlabs.com/sitemap-index.xml',
};
const blockAll = { rules: { userAgent: '*', disallow: '/' } };

describe('deploymentKind', () => {
  it('follows VERCEL_ENV on Vercel', () => {
    expect(deploymentKind({ VERCEL_ENV: 'production' })).toBe('production');
    expect(deploymentKind({ VERCEL_ENV: 'preview' })).toBe('preview');
    expect(deploymentKind({ VERCEL_ENV: 'development' })).toBe('preview');
    // Even when NEXT_PUBLIC_SERVER_URL is the production URL (e.g. copied to Preview).
    expect(
      deploymentKind({
        VERCEL_ENV: 'preview',
        NEXT_PUBLIC_SERVER_URL: 'https://blog.xmartlabs.com',
      })
    ).toBe('preview');
  });

  it('outside Vercel: production only at the production URL', () => {
    expect(
      deploymentKind({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'https://blog.xmartlabs.com/',
      })
    ).toBe('production');
    expect(
      deploymentKind({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'https://staging.example.com',
      })
    ).toBe('preview');
    expect(deploymentKind({ NODE_ENV: 'production' })).toBe('preview');
  });

  it('localhost is local (dev, CI and e2e builds)', () => {
    expect(deploymentKind({})).toBe('local');
    expect(
      deploymentKind({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'http://localhost:3003',
      })
    ).toBe('local');
    expect(
      deploymentKind({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'http://127.0.0.1:3000',
      })
    ).toBe('local');
  });
});

describe('robotsConfig', () => {
  it('allows crawling on production, except the CMS and internal routes', () => {
    expect(robotsConfig({ VERCEL_ENV: 'production' })).toEqual(productionRules);
    expect(
      robotsConfig({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'https://blog.xmartlabs.com',
      })
    ).toEqual(productionRules);
  });

  it('disallows everything on preview deployments', () => {
    expect(robotsConfig({ VERCEL_ENV: 'preview' })).toEqual(blockAll);
    expect(isNoIndexDeployment({ VERCEL_ENV: 'preview' })).toBe(true);
    expect(isNoIndexDeployment({ VERCEL_ENV: 'production' })).toBe(false);
  });

  it('serves the production rules locally', () => {
    expect(
      robotsConfig({
        NODE_ENV: 'production',
        NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
      })
    ).toEqual(productionRules);
    expect(isNoIndexDeployment({})).toBe(false);
  });
});
