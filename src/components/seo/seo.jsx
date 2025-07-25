import React from 'react';
import { useSiteMetadata } from '../../hooks/use-site-metadata';
import { withPrefix } from 'gatsby-link';

export const Seo = ({
  title,
  description,
  pathname,
  children,
  seoImageUrl,
}) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
  } = useSiteMetadata();

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`,
  };

  return (
    <>
      <meta name="title" property="og:title" content={seo.title} />
      <meta name="url" property="og:url" content={seo.url} />
      <meta
        name="description"
        property="og:description"
        content={seo.description}
      />
      <meta
        name="image"
        property="og:image"
        content={
          seoImageUrl
            ? `${siteUrl}${seoImageUrl}`
            : `${siteUrl}/images/og-thumbnail.png`
        }
      />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <script src={withPrefix('identity.js')} type="text/javascript"></script>
      {children}
    </>
  );
};
