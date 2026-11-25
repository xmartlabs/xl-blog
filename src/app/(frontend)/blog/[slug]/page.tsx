import { draftMode, headers } from 'next/headers';
import { notFound } from 'next/navigation';
import React from 'react';

import { LivePreviewPost } from '@/components/post/LivePreviewPost';
import { PostView } from '@/components/post/PostView';
import { Seo } from '@/components/seo/Seo';
import { getPayloadClient } from '@/lib/payload';
import { renderPostBody } from '@/lib/post-body';
import {
  asDoc,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  postThumbnail,
} from '@/lib/posts';
import type { Author, Category } from '@/payload-types';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllPostSlugs()).map((slug) => ({ slug }));
}

/**
 * Draft mode is only turned on by /next/preview for signed-in users, but its cookie outlives
 * the session; drafts are shown only while the visitor is still signed in.
 */
async function canSeeDrafts() {
  if (!(await draftMode()).isEnabled) return false;
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  return Boolean(user);
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const preview = await canSeeDrafts();
  const post = await getPostBySlug(slug, {
    draft: preview,
  });
  if (!post) notFound();
  if (!asDoc<Author>(post.author) || !asDoc<Category>(post.category)) {
    if (!preview) notFound();
  }

  const body = renderPostBody(post);
  const relatedPosts = await getRelatedPosts(post);
  const seo = (
    <Seo
      pathname={`/blog/${post.slug}/`}
      title={post.title}
      image={postThumbnail(post)}
    />
  );

  if (preview) {
    return (
      <>
        {seo}
        <LivePreviewPost
          initialPost={post}
          initialBody={body}
          relatedPosts={relatedPosts}
        />
      </>
    );
  }

  return (
    <>
      {seo}
      <PostView post={post} {...body} relatedPosts={relatedPosts} />
    </>
  );
}
