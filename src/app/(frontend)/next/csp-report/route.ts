import {
  CSP_REPORT_CONTENT_TYPES,
  CSP_REPORT_MAX_LINES,
  formatCspViolation,
  parseCspReport,
  readLimitedText,
} from '@/lib/csp-report';

/**
 * Collects Content Security Policy violation reports (`report-uri` / `report-to` of the CSP
 * header, src/lib/csp.mjs) and logs one compact `[csp] …` line per violation. Nothing is
 * stored. Always answers 204 (or 413/415), so a browser has nothing to retry.
 */
export async function POST(request: Request) {
  const contentType = (request.headers.get('content-type') ?? '')
    .split(';')[0]
    .trim()
    .toLowerCase();
  if (!CSP_REPORT_CONTENT_TYPES.includes(contentType)) {
    return new Response(null, { status: 415 });
  }
  const text = await readLimitedText(request);
  if (text === null) return new Response(null, { status: 413 });
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return new Response(null, { status: 204 });
  }
  const violations = parseCspReport(payload);
  for (const violation of violations.slice(0, CSP_REPORT_MAX_LINES)) {
    console.warn(formatCspViolation(violation));
  }
  if (violations.length > CSP_REPORT_MAX_LINES) {
    console.warn(
      `[csp] … and ${violations.length - CSP_REPORT_MAX_LINES} more in the same report`
    );
  }
  return new Response(null, { status: 204 });
}
