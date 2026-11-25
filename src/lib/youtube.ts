/** YouTube video ids are 11 characters of [A-Za-z0-9_-]. */
const VIDEO_ID = /^[\w-]{11}$/;

/** youtube.com, youtube-nocookie.com and their subdomains (www., m., music., …). */
const isYouTubeHost = (host: string) =>
  ['youtube.com', 'youtube-nocookie.com'].some(
    (domain) => host === domain || host.endsWith(`.${domain}`)
  );

/** Path prefixes followed by the id: /embed/<id>, /shorts/<id>, /live/<id>, /v/<id>. */
const ID_PATHS = new Set(['embed', 'shorts', 'live', 'v']);

/**
 * The video id of a YouTube link (youtube.com/watch?v=…, youtu.be/…, /embed/…, /shorts/…,
 * /live/…, with or without https:// and extra parameters), or the input itself when it isn't
 * a recognizable link (e.g. a bare id), trimmed. Bare ids are returned unchanged.
 */
export function extractYouTubeId(input: string): string {
  const value = input.trim();
  if (!value || VIDEO_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(
      /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`
    );
  } catch {
    return value;
  }
  const host = url.hostname.toLowerCase();
  const segments = url.pathname.split('/').filter(Boolean);

  let id: string | null | undefined;
  if (host === 'youtu.be' || host === 'www.youtu.be') {
    id = segments[0];
  } else if (isYouTubeHost(host)) {
    if (segments[0] === 'watch') id = url.searchParams.get('v');
    else if (ID_PATHS.has(segments[0] ?? '')) id = segments[1];
  }
  return id && /^[\w-]+$/.test(id) ? id : value;
}

/** True when the value is a YouTube link or id the renderer can embed. */
export const isValidYouTubeInput = (input: string) =>
  VIDEO_ID.test(extractYouTubeId(input));
