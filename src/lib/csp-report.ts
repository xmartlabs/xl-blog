/**
 * Parsing of CSP violation reports (POST /next/csp-report/) into compact log lines.
 *
 * Two formats: the legacy `report-uri` one (`application/csp-report`, one
 * `{"csp-report": {...}}` object) and the Reporting API one (`application/reports+json`, an
 * array of `{type: "csp-violation", body: {...}}`). URLs are logged without query string or
 * fragment (they may carry tokens), and every field is truncated.
 */

export const CSP_REPORT_MAX_BYTES = 16 * 1024;
/** Lines logged per request at most (Reporting API batches can hold many reports). */
export const CSP_REPORT_MAX_LINES = 10;

export const CSP_REPORT_CONTENT_TYPES = [
  'application/csp-report',
  'application/reports+json',
  'application/json',
];

export interface CspViolation {
  disposition: string;
  directive: string;
  blocked: string;
  document: string;
  source: string;
  sample: string;
}

const MAX_FIELD = 200;

const str = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : '';

const clip = (value: string) =>
  value.length > MAX_FIELD ? `${value.slice(0, MAX_FIELD)}…` : value;

/** Drops query string and fragment; keeps keywords such as `inline`, `eval`, `data`. */
export const stripUrl = (value: unknown) => {
  const raw = str(value);
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) return clip(raw);
  try {
    const url = new URL(raw);
    return clip(`${url.origin}${url.pathname}`);
  } catch {
    return clip(raw.split(/[?#]/)[0]);
  }
};

type Json = Record<string, unknown>;
const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function fromLegacy(report: Json): CspViolation {
  const line = str(report['line-number']);
  return {
    disposition: str(report.disposition) || 'unknown',
    directive: clip(
      str(report['effective-directive']) || str(report['violated-directive'])
    ),
    blocked: stripUrl(report['blocked-uri']),
    document: stripUrl(report['document-uri']),
    source: stripUrl(report['source-file']) + (line ? `:${line}` : ''),
    sample: clip(str(report['script-sample'])),
  };
}

function fromReportingApi(body: Json): CspViolation {
  const line = str(body.lineNumber);
  return {
    disposition: str(body.disposition) || 'unknown',
    directive: clip(str(body.effectiveDirective)),
    blocked: stripUrl(body.blockedURL),
    document: stripUrl(body.documentURL),
    source: stripUrl(body.sourceFile) + (line ? `:${line}` : ''),
    sample: clip(str(body.sample)),
  };
}

/** The violations in a report payload (either format); [] for anything else. */
export function parseCspReport(payload: unknown): CspViolation[] {
  if (isObject(payload) && isObject(payload['csp-report'])) {
    return [fromLegacy(payload['csp-report'])];
  }
  if (Array.isArray(payload)) {
    return payload
      .filter(
        (entry): entry is Json =>
          isObject(entry) &&
          entry.type === 'csp-violation' &&
          isObject(entry.body)
      )
      .map((entry) => fromReportingApi(entry.body as Json));
  }
  return [];
}

export const formatCspViolation = (v: CspViolation) =>
  `[csp] ${v.disposition} ${v.directive} blocked=${v.blocked || '-'} document=${v.document || '-'}` +
  (v.source ? ` source=${v.source}` : '') +
  (v.sample ? ` sample=${JSON.stringify(v.sample)}` : '');

/** Reads at most `limit` bytes of the body; null when it's larger. */
export async function readLimitedText(
  request: Request,
  limit = CSP_REPORT_MAX_BYTES
): Promise<string | null> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > limit) return null;
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}
