import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import readingTime from 'reading-time';

import { Category } from '../../../../components/category';
import { ClockIcon } from '../../../../components/icons';
import { MoreBlogsSection } from '../../../../components/more-blogs-section';
import { PostInteractions } from '../../../../components/post-interactions/post-interactions';
import { lexicalToHTML } from '../../../../components/rich-text/to-html';
import { XlProfileLinks } from '../../../../components/social-element/xl-profile-links';
import { Tags } from '../../../../components/tags/tags';
import {
  asDoc,
  authorImage,
  formatPostDate,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
  postThumbnail,
} from '../../../../lib/posts';
import { SITE } from '../../../../lib/site';
import type {
  Author,
  Category as CategoryDoc,
} from '../../../../payload-types';

const HERO_FALLBACK_IMAGE = '/images/image.png';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE.url}/blog/${post.slug}/`;
  const image = new URL(
    postThumbnail(post) || '/images/og-thumbnail.png',
    SITE.url
  ).href;
  return {
    title: post.title,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      url,
      description: SITE.description,
      images: [image],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const author = asDoc<Author>(post.author);
  const category = asDoc<CategoryDoc>(post.category);
  if (!author || !category) notFound();

  const bodyHtml = lexicalToHTML(post.content as never);
  // Imported posts keep the old value (measured on the Markdown source); new or edited posts
  // measure the rendered text.
  const timeToRead =
    post.legacyReadingTime ||
    readingTime(bodyHtml.replace(/<[^>]+>/g, ' ')).text;
  const usesInstagram = bodyHtml.includes('instagram-media');
  const relatedPosts = await getRelatedPosts(post);
  const thumbnail = postThumbnail(post);

  return (
    <>
      {usesInstagram && (
        <script async src="https://www.instagram.com/embed.js" />
      )}
      <div id="containerDiv">
        <PostInteractions pathname={`/blog/${post.slug}/`} />
        <div className="p-[10rem_44%_20rem_16%] bg-blue-six max-lg:p-[10rem_8%_20rem_8%] max-sm:min-h-full max-sm:p-[8rem_1rem_6rem_5%]">
          <div className="flex flex-row items-baseline">
            <Category
              data={category.name}
              className="flex justify-center text-[0.8rem] leading-[2rem] font-black text-blue-one bg-neutral-100 mb-4 w-auto px-4 h-[1.8rem] uppercase tracking-[0.1rem] max-sm:w-auto max-sm:px-4 max-sm:h-[1.5rem] max-sm:leading-[1.7rem]"
            />
          </div>
          <h1 className="my-2 mx-0 text-heading-one text-blue-one font-link max-sm:m-0">
            {post.title}
          </h1>
          <div className="w-full">
            <div className="flex flex-row mt-8">
              <img
                src={authorImage(author) ?? undefined}
                alt={author.name}
                className="rounded-[10px] mr-8 w-[5.5rem] h-full"
              />
              <div className="flex flex-col items-start justify-between">
                <a
                  href={author.profileUrl ?? undefined}
                  className="no-underline font-link font-bold"
                >
                  {author.name}
                </a>
                <label className="w-auto text-label-bold text-gray-two font-semibold">
                  {formatPostDate(post.publishedDate)}
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
          title={category.name}
          categoryId={category.slug}
        />
      </div>
    </>
  );
}
