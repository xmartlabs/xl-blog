import { notFound } from 'next/navigation';
import React from 'react';

import { Seo } from '@/components/seo/Seo';
import { getTags } from '@/lib/posts';

type Props = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  return (await getTags()).map((tag) => ({ tag: tag.segment }));
}

export default async function TagPage({ params }: Props) {
  const { tag: segment } = await params;
  const tag = (await getTags()).find((t) => t.segment === segment);
  if (!tag) notFound();
  const header = `${tag.posts.length} post${tag.posts.length === 1 ? '' : 's'} tagged with "${tag.name}"`;
  return (
    <>
      <Seo pathname={`/tags/${segment}/`} />
      <div className="p-[10rem_16%_5rem]">
        <h1>{header}</h1>
        <ul>
          {tag.posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}/`}>{post.title}</a>
            </li>
          ))}
        </ul>
        <a href="/tags/">All tags</a>
      </div>
    </>
  );
}
