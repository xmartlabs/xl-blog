// Parsing anchor only: nothing is ever fetched from or redirected to this origin, and it never
// reaches the returned value. `.invalid` (RFC 2606) can't collide with a real host. If a
// candidate manages to change this origin while parsing, it would change the real one too, so
// "the origin survived" is what proves the input was a bare path.
const PARSE_ONLY_ORIGIN = 'https://internal.invalid';

// Characters browsers strip while parsing a URL: "/\tevil.com" would reach the network as
// "//evil.com". Rejected outright rather than stripped.
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

/**
 * Narrows a user-supplied redirect target (a `?path=` or `?redirect=` parameter) down to a
 * same-site absolute path, or returns `fallback`.
 *
 * Rejected: anything not starting with a single `/` (absolute URLs, schemes, relative paths),
 * protocol-relative `//host`, backslashes anywhere (`/\host` is `//host` to browsers),
 * control characters (raw or percent-encoded right after the leading slash), and paths whose
 * normalized form becomes protocol-relative (`/..//evil.com`). The returned value is the
 * normalized path + query + hash, never an origin. Use it for every value that reaches a
 * `Location` header (open redirects, CWE-601).
 */
export function safeInternalPath(
  input: string | null | undefined,
  fallback = '/'
): string {
  if (typeof input !== 'string' || !input) return fallback;
  if (CONTROL_CHARS.test(input) || input.includes('\\')) return fallback;
  if (!input.startsWith('/') || input.startsWith('//')) return fallback;
  // Percent-encoded slash, backslash or control character right after the first slash: some
  // servers and proxies decode before routing, turning it into `//host`.
  if (/^\/%(?:25)*(?:2f|5c|0[0-9a-f]|1[0-9a-f]|7f)/i.test(input))
    return fallback;

  let resolved: URL;
  try {
    resolved = new URL(input, PARSE_ONLY_ORIGIN);
  } catch {
    return fallback;
  }
  if (resolved.origin !== PARSE_ONLY_ORIGIN) return fallback;

  // Re-check the normalized output: "/..//evil.com" keeps the origin above but normalizes to
  // "//evil.com", protocol-relative once it lands in a Location header.
  const path = `${resolved.pathname}${resolved.search}${resolved.hash}`;
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return fallback;
  }
  return path;
}
