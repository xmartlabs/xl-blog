import { describe, expect, it } from 'vitest';

import { authorIdOfUser } from '../src/lib/default-author';

describe('authorIdOfUser', () => {
  it('returns the linked author id, as an id or populated', () => {
    expect(authorIdOfUser({ id: 1, author: 7 })).toBe(7);
    expect(authorIdOfUser({ id: 1, author: { id: 7, name: 'Jane' } })).toBe(7);
    expect(authorIdOfUser({ id: 1, author: 'abc' })).toBe('abc');
  });

  it('returns undefined without a user or a linked author', () => {
    expect(authorIdOfUser(null)).toBeUndefined();
    expect(authorIdOfUser(undefined)).toBeUndefined();
    expect(authorIdOfUser({ id: 1 })).toBeUndefined();
    expect(authorIdOfUser({ id: 1, author: null })).toBeUndefined();
    expect(authorIdOfUser({ id: 1, author: '' })).toBeUndefined();
    expect(authorIdOfUser({ id: 1, author: {} })).toBeUndefined();
  });
});
