import { describe, expect, it } from 'vitest';

import { lexicalToHTML } from '../src/components/rich-text/to-html';
import { extractYouTubeId, isValidYouTubeInput } from '../src/lib/youtube';

const ID = 'dQw4w9WgXcQ';

describe('extractYouTubeId', () => {
  it.each([
    [ID],
    [`  ${ID}  `],
    [`https://www.youtube.com/watch?v=${ID}`],
    [`https://www.youtube.com/watch?v=${ID}&t=42s`],
    [`https://www.youtube.com/watch?feature=share&v=${ID}`],
    [`https://m.youtube.com/watch?v=${ID}`],
    [`https://music.youtube.com/watch?v=${ID}&list=RD`],
    [`youtube.com/watch?v=${ID}`],
    [`www.youtube.com/watch?v=${ID}`],
    [`https://youtu.be/${ID}`],
    [`https://youtu.be/${ID}?si=abc123&t=10`],
    [`youtu.be/${ID}`],
    [`https://www.youtube.com/embed/${ID}`],
    [`https://www.youtube.com/embed/${ID}?start=30`],
    [`https://www.youtube-nocookie.com/embed/${ID}`],
    [`https://www.youtube.com/shorts/${ID}`],
    [`https://youtube.com/shorts/${ID}?feature=share`],
    [`https://www.youtube.com/live/${ID}`],
    [`http://www.youtube.com/v/${ID}`],
  ])('%s → the id', (input) => {
    expect(extractYouTubeId(input)).toBe(ID);
  });

  it('returns other values unchanged (trimmed), as the renderer always did', () => {
    expect(extractYouTubeId('abc')).toBe('abc');
    expect(extractYouTubeId(' some-id ')).toBe('some-id');
    expect(extractYouTubeId('https://vimeo.com/12345')).toBe(
      'https://vimeo.com/12345'
    );
    expect(extractYouTubeId('https://www.youtube.com/@channel')).toBe(
      'https://www.youtube.com/@channel'
    );
    expect(extractYouTubeId('')).toBe('');
  });

  it('validates links and ids', () => {
    expect(isValidYouTubeInput(`https://youtu.be/${ID}`)).toBe(true);
    expect(isValidYouTubeInput(ID)).toBe(true);
    expect(isValidYouTubeInput('https://vimeo.com/12345')).toBe(false);
    expect(isValidYouTubeInput('hello')).toBe(false);
  });
});

describe('video block rendering', () => {
  const render = (youtubeUrlOrId: string) =>
    lexicalToHTML({
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [
          {
            type: 'block',
            version: 2,
            format: '',
            fields: {
              id: 'x',
              blockType: 'video',
              youtubeUrlOrId,
              title: 'Xmartlabs',
              width: '100%',
              height: '560px',
            },
          },
        ],
      },
    } as unknown as Parameters<typeof lexicalToHTML>[0]);

  it('embeds the same iframe for an id and for any link to it', () => {
    const expected = `<iframe width="100%" height="560px" src="https://www.youtube.com/embed/${ID}" title="Xmartlabs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`;
    expect(render(ID)).toBe(expected);
    expect(render(`https://youtu.be/${ID}`)).toBe(expected);
    expect(render(`https://www.youtube.com/shorts/${ID}`)).toBe(expected);
    expect(render(`https://www.youtube.com/watch?v=${ID}&t=1`)).toBe(expected);
  });
});
