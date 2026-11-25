import React from 'react';

import type { CardData } from '../../lib/post-utils';
import {
  asDoc,
  authorImage,
  formatPostDate,
  postThumbnail,
} from '../../lib/post-utils';
import type {
  Author,
  Category as CategoryDoc,
  Post,
} from '../../payload-types';
import { Category } from '../category';
import { ClockIcon } from '../icons';
import { MoreBlogsSection } from '../more-blogs-section';
import { PostInteractions } from '../post-interactions/post-interactions';
import { XlProfileLinks } from '../social-element/xl-profile-links';
import { Tags } from '../tags/tags';
import { externalScriptSources } from './embed-scripts';
import { EmbedScripts } from './EmbedScripts';

const HERO_FALLBACK_IMAGE = '/images/image.png';

export interface PostViewProps {
  post: Post;
  /** The rendered body (see components/rich-text/to-html.ts). */
  bodyHtml: string;
  timeToRead: string;
  relatedPosts: CardData[];
  /** Live preview: always mount the embed loader, the body changes on the client. */
  live?: boolean;
}

/**
 * A post page (everything between the nav menu and the footer). Shared by the static page
 * and the live-preview client component, so it must stay free of server-only imports.
 */
export function PostView({
  post,
  bodyHtml,
  timeToRead,
  relatedPosts,
  live = false,
}: PostViewProps) {
  const author = asDoc<Author>(post.author);
  const category = asDoc<CategoryDoc>(post.category);
  const thumbnail = postThumbnail(post, 'hero');
  const usesInstagram = bodyHtml.includes('instagram-media');
  const hasEmbedScripts = externalScriptSources(bodyHtml).length > 0;

  return (
    <>
      {usesInstagram && (
        <script async src="https://www.instagram.com/embed.js" />
      )}
      {(live || hasEmbedScripts) && <EmbedScripts html={bodyHtml} />}
      <div id="containerDiv">
        <PostInteractions pathname={`/blog/${post.slug}/`} />
        <div className="p-[10rem_44%_20rem_16%] bg-blue-six max-lg:p-[10rem_8%_20rem_8%] max-sm:min-h-full max-sm:p-[8rem_1rem_6rem_5%]">
          <div className="flex flex-row items-baseline">
            <Category
              data={category?.name ?? ''}
              className="flex justify-center text-[0.8rem] leading-[2rem] font-black text-blue-one bg-neutral-100 mb-4 w-auto px-4 h-[1.8rem] uppercase tracking-[0.1rem] max-sm:w-auto max-sm:px-4 max-sm:h-[1.5rem] max-sm:leading-[1.7rem]"
            />
          </div>
          <h1 className="my-2 mx-0 text-heading-one text-blue-one font-link max-sm:m-0">
            {post.title}
          </h1>
          <div className="w-full">
            <div className="flex flex-row mt-8">
              <img
                src={(author && authorImage(author)) ?? undefined}
                alt={author?.name ?? ''}
                className="rounded-[10px] mr-8 w-[5.5rem] h-full"
              />
              <div className="flex flex-col items-start justify-between">
                <a
                  href={author?.profileUrl ?? undefined}
                  className="no-underline font-link font-bold"
                >
                  {author?.name}
                </a>
                <label className="w-auto text-label-bold text-gray-two font-semibold">
                  {post.publishedDate ? formatPostDate(post.publishedDate) : ''}
                </label>
                <label className="w-auto text-label-bold text-gray-two font-semibold">
                  <ClockIcon className="mr-[0.5rem] inline" />
                  {timeToRead}
                </label>
              </div>
            </div>
          </div>
        </div>
        <img
          src={thumbnail || HERO_FALLBACK_IMAGE}
          data-fallback={HERO_FALLBACK_IMAGE}
          // The fallback script may swap `src` before hydration.
          suppressHydrationWarning
          alt="Blog Main Image"
          className="transform translate-y-[-230px] ml-[16%] mb-20 w-[51.3rem] max-w-[85vh] h-auto max-lg:ml-[8%] max-sm:transform max-sm:-translate-y-12 max-sm:m-0 max-sm:w-full max-sm:h-auto"
        />
        {/* Same as <RichText>, but the HTML is already rendered for the reading time. */}
        <div
          className="bodyPostContainer"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        <div className="flex flex-row-reverse justify-start items-baseline p-[5rem_30%_2rem_16%] max-xxl:pr-[30%] max-lg:px-[8%] max-sm:flex-col max-sm:p-0">
          <div className="flex flex-row justify-end max-sm:justify-start">
            <XlProfileLinks className="flex flex-row static items-center w-full z-0 max-sm:w-auto [&_a]:flex [&_a]:items-center [&_a]:m-[0.7rem]" />
          </div>
          <Tags
            blogTags={post.tags ?? []}
            className="max-sm:w-[90%] max-sm:mt-4 max-sm:ml-4"
          />
        </div>
        <MoreBlogsSection
          relatedPosts={relatedPosts}
          title={category?.name ?? ''}
          categoryId={category?.slug ?? ''}
        />
      </div>
    </>
  );
}
