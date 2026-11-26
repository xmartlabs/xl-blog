/* eslint-disable @next/next/no-img-element -- Plain <img> on purpose: the markup must match the old site exactly (pixel-parity tests), and images are served from /images or external URLs as before. */
import React from 'react';

const Image = ({
  src,
  alt = 'Xmartlabs',
  width = '100%',
  height = '315px',
  aspectRatio = '16/9',
}) => {
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

export { Image };
