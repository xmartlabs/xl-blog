import fs from 'node:fs';

import { REPORT_DIR } from './lib/settings';

/** Starts every run with an empty report (the live cache in `.cache/` is kept). */
export default function globalSetup() {
  fs.rmSync(REPORT_DIR, { recursive: true, force: true });
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}
