import { expect, test } from '@playwright/test';

import { apiAs, json } from './lib/api';
import { E2E_CRON_SECRET } from './lib/env';

type User = { id: number; email: string; roles: string[] };

test('an editor cannot promote themselves', async () => {
  const editor = await apiAs('editor');
  try {
    const { user } = await json<{ user: User }>(
      await editor.get('/api/users/me/')
    );
    expect(user.roles).toEqual(['editor']);

    // Field access ignores `roles` for editors (the rest of the update goes through).
    const response = await editor.patch(`/api/users/${user.id}/`, {
      data: { roles: ['admin'], name: 'E2E editor (renamed)' },
    });
    expect([200, 403]).toContain(response.status());

    const { user: after } = await json<{ user: User }>(
      await editor.get('/api/users/me/')
    );
    expect(after.roles).toEqual(['editor']);

    // Still an editor where it matters: admin-only operations are refused.
    const categories = await editor.post('/api/categories/', {
      data: { name: 'Nope', slug: 'e2e-nope' },
    });
    expect(categories.status()).toBe(403);
    const users = await editor.post('/api/users/', {
      data: {
        email: 'e2e-other@example.test',
        password: 'irrelevant-test-value',
        roles: ['admin'],
      },
    });
    expect(users.status()).toBe(403);
  } finally {
    await editor.dispose();
  }
});

test('/next/revalidate/ needs the cron secret or an admin', async () => {
  const anonymous = await apiAs('anonymous');
  const editor = await apiAs('editor');
  const admin = await apiAs('admin');
  try {
    expect((await anonymous.post('/next/revalidate/')).status()).toBe(401);
    expect(
      (
        await anonymous.post('/next/revalidate/', {
          headers: { Authorization: 'Bearer wrong-secret' },
        })
      ).status()
    ).toBe(401);
    expect((await editor.post('/next/revalidate/')).status()).toBe(401);

    const withSecret = await anonymous.post('/next/revalidate/', {
      headers: { Authorization: `Bearer ${E2E_CRON_SECRET}` },
    });
    expect(withSecret.status()).toBe(200);
    expect(await withSecret.json()).toEqual({ revalidated: true });

    expect((await admin.post('/next/revalidate/')).status()).toBe(200);
  } finally {
    await anonymous.dispose();
    await editor.dispose();
    await admin.dispose();
  }
});

test('/api/payload-jobs/run needs the cron secret or an admin', async () => {
  const anonymous = await apiAs('anonymous');
  const editor = await apiAs('editor');
  try {
    for (const [api, headers] of [
      [anonymous, {}],
      [anonymous, { Authorization: 'Bearer wrong-secret' }],
      [editor, {}],
    ] as const) {
      const response = await api.get('/api/payload-jobs/run/', { headers });
      expect([401, 403]).toContain(response.status());
    }
    const withSecret = await anonymous.get('/api/payload-jobs/run/', {
      headers: { Authorization: `Bearer ${E2E_CRON_SECRET}` },
    });
    expect(withSecret.status()).toBe(200);
  } finally {
    await anonymous.dispose();
    await editor.dispose();
  }
});
