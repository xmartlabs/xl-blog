import React from 'react';

import { NotFoundPage } from '@/components/not-found/NotFoundPage';
import { Seo } from '@/components/seo/Seo';
import { getAuthorPages } from '@/lib/posts';

type Props = { params: Promise<{ author: string }> };

export async function generateStaticParams() {
  return (await getAuthorPages()).map((author) => ({
    author: author.segment,
  }));
}

export default async function AuthorPage({ params }: Props) {
  const { author: segment } = await params;
  const author = (await getAuthorPages()).find((a) => a.segment === segment);
  if (!author) return <NotFoundPage />;
  const { posts } = author;
  const header = `${posts.length} post${posts.length === 1 ? '' : 's'} written by "${author.name}"`;
  return (
    <>
      <Seo pathname={`/authors/${segment}/`} />
      <div className="p-[10rem_16%_5rem]">
        <h1>{header}</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/${post.slug}/`}>{post.title}</a>
            </li>
          ))}
        </ul>
        <a href="/">back to home</a>
      </div>
    </>
  );
}
