import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ src, alt, width, height, aspectRatio }) => {
  const isMultiple = Array.isArray(src);

  const imageStyle = {
    width: width,
    height: height,
    objectFit: 'cover',
    aspectRatio: aspectRatio,
    margin: 0,
    padding: 0,
    display: isMultiple ? 'inline' : 'block',
  };

  const containerStyle = {
    display: isMultiple ? 'inline' : 'block',
  };

  if (isMultiple) {
    return (
      <div style={containerStyle}>
        {src.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${alt} ${index + 1}`}
            style={imageStyle}
          />
        ))}
      </div>
    );
  }

  return <img src={src} alt={alt} style={imageStyle} />;
};

Image.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  alt: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  aspectRatio: PropTypes.string,
};

Image.defaultProps = {
  width: '100%',
  height: '315px',
  alt: 'Xmartlabs',
  aspectRatio: '16/9',
};

export { Image };
