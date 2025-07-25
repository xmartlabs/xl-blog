import React from 'react';
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import { classnames } from '../../helpers';
import * as styles from './flexible-image.module.scss';

const FlexibleImage = ({
  src,
  alt,
  size = 'medium',
  aspectRatio = 'auto',
  layout = 'constrained',
  className,
  caption,
  loading = 'lazy',
  quality = 95,
  formats = ['auto', 'webp', 'avif'],
  placeholder = 'blurred',
  backgroundColor = 'transparent',
  ...props
}) => {
  // Handle different image sources
  const renderImage = () => {
    // If src is a string (static image path)
    if (typeof src === 'string') {
      return (
        <StaticImage
          src={src}
          alt={alt}
          className={classnames(styles.image, styles[size], className)}
          layout={layout}
          aspectRatio={aspectRatio !== 'auto' ? aspectRatio : undefined}
          loading={loading}
          quality={quality}
          formats={formats}
          placeholder={placeholder}
          backgroundColor={backgroundColor}
          {...props}
        />
      );
    }

    // If src is a Gatsby image data object
    const image = getImage(src);
    if (image) {
      return (
        <GatsbyImage
          image={image}
          alt={alt}
          className={classnames(styles.image, styles[size], className)}
          loading={loading}
          backgroundColor={backgroundColor}
          {...props}
        />
      );
    }

    // Fallback for invalid src
    return (
      <div className={classnames(styles.placeholder, styles[size], className)}>
        <span>Image not found</span>
      </div>
    );
  };

  return (
    <figure className={styles.container}>
      {renderImage()}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
};

FlexibleImage.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.oneOf([
    'xs',
    'small',
    'medium',
    'large',
    'xl',
    'full',
    'custom',
  ]),
  aspectRatio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  layout: PropTypes.oneOf([
    'constrained',
    'fixed',
    'fullWidth',
    'constrainedToParent',
  ]),
  className: PropTypes.string,
  caption: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  quality: PropTypes.number,
  formats: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.oneOf(['blurred', 'none']),
  backgroundColor: PropTypes.string,
};

export default FlexibleImage;
