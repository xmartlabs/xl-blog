import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

import { NotFoundContent } from './NotFoundContent';

function TriggerNotFound(): never {
  notFound();
}

/**
 * Return this from a statically generated page whose param matches nothing (unknown post,
 * category, tag, author or page number) instead of calling `notFound()` directly.
 *
 * Why: in Next 16, `notFound()` thrown by a page escapes the server render (React can't run
 * the not-found error boundary on the server), so Next answers 404 with an empty error shell
 * (`<html id="__next_error__">`) and the 404 page only appears once the client JavaScript
 * runs. Thrown inside this Suspense boundary instead, the server render succeeds with the
 * fallback (the styled 404) in the HTML, and the `notFound()` still sets the 404 status
 * because static and ISR renders are buffered (nothing is sent before they finish). On the
 * client, the boundary re-renders, the error reaches (frontend)/not-found.tsx, which shows
 * the same component.
 *
 * That only works for buffered (static/ISR) renders. In draft mode pages render dynamically
 * and stream, so the status would already be 200: there a plain notFound() (404 status,
 * client-rendered 404 page) is used instead.
 */
export async function NotFoundPage() {
  if ((await draftMode()).isEnabled) notFound();
  return (
    <Suspense fallback={<NotFoundContent />}>
      <TriggerNotFound />
    </Suspense>
  );
}
