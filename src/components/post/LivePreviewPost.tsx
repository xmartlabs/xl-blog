'use client';

import { useLivePreview } from '@payloadcms/live-preview-react';
import React, { useEffect, useRef, useState } from 'react';

import type { Post } from '../../payload-types';
import { renderPreviewBody } from './actions';
import { PostView, type PostViewProps } from './PostView';

/**
 * Draft mode only (never on the published pages): the post updates in place while it is
 * edited in the admin panel's live preview. Title, author, category, thumbnail and tags come
 * straight from the form; the body is re-rendered on the server (same renderer as production)
 * whenever the content changes.
 */
export function LivePreviewPost({
  initialPost,
  initialBody,
  relatedPosts,
}: {
  initialPost: Post;
  initialBody: Pick<PostViewProps, 'bodyHtml' | 'timeToRead'>;
  relatedPosts: PostViewProps['relatedPosts'];
}) {
  const [serverURL] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.origin
  );
  const { data } = useLivePreview<Post>({
    initialData: initialPost,
    serverURL,
    depth: 2,
  });
  const [body, setBody] = useState(initialBody);

  const lastContent = useRef(JSON.stringify(initialPost.content));
  useEffect(() => {
    const content = JSON.stringify(data.content);
    if (content === lastContent.current) return;
    lastContent.current = content;
    let cancelled = false;
    renderPreviewBody({
      content: data.content,
      // The stored reading time is dropped once the body changes.
      legacyReadingTime: null,
    })
      .then((next) => {
        if (!cancelled) setBody(next);
      })
      .catch(() => {
        // Keep the last rendered body (e.g. the session expired).
      });
    return () => {
      cancelled = true;
    };
  }, [data.content]);

  return (
    <PostView
      post={data}
      bodyHtml={body.bodyHtml}
      timeToRead={body.timeToRead}
      relatedPosts={relatedPosts}
      live
    />
  );
}
