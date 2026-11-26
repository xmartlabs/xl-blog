/** `src` of every external `<script>` in an HTML string (shared by server and client). */
export const externalScriptSources = (html: string) =>
  [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(
    (m) => m[1]
  );
