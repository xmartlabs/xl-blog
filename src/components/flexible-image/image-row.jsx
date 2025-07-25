import React from 'react';
import PropTypes from 'prop-types';
import FlexibleImage from './flexible-image';
import { classnames } from '../../helpers';
import * as styles from './image-row.module.scss';

const ImageRow = ({
  images,
  spacing = 'medium',
  alignment = 'center',
  wrap = true,
  className,
  caption,
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <figure className={classnames(styles.container, className)}>
      <div
        className={classnames(
          styles.imageRow,
          styles[`spacing-${spacing}`],
          styles[`align-${alignment}`],
          !wrap && styles.noWrap
        )}
      >
        {images.map((imageConfig, index) => {
          const {
            src,
            alt,
            size = 'medium',
            caption: imageCaption,
            ...imageProps
          } = imageConfig;

          return (
            <div key={index} className={styles.imageWrapper}>
              <FlexibleImage
                src={src}
                alt={alt}
                size={size}
                caption={imageCaption}
                {...imageProps}
              />
            </div>
          );
        })}
      </div>
      {caption && (
        <figcaption className={styles.rowCaption}>{caption}</figcaption>
      )}
    </figure>
  );
};

ImageRow.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
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
      caption: PropTypes.string,
    })
  ).isRequired,
  spacing: PropTypes.oneOf(['tight', 'small', 'medium', 'large']),
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
  wrap: PropTypes.bool,
  className: PropTypes.string,
  caption: PropTypes.string,
};

export default ImageRow;
