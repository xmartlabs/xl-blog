import React from 'react';

import { Seo } from '@/components/seo/Seo';
import { getTags } from '@/lib/posts';

export default async function TagsPage() {
  const tags = await getTags();
  return (
    <>
      <Seo pathname="/tags/" />
      <div className="p-[10rem_16%_5rem]">
        <h1>Tags</h1>
        <ul>
          {tags.map((tag) => (
            <li key={tag.segment}>
              <a href={`/tags/${tag.segment}/`}>
                {tag.name} ({tag.posts.length})
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
