import { buildReport, printSummary } from './lib/report';

/** Writes report/index.html and report/report.json from the per-page results. */
export default function globalTeardown() {
  const report = buildReport();
  if (report) printSummary(report);
}
