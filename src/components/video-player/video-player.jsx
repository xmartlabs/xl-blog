import React from 'react';

// Self-hosted videos live in /images by default; set NEXT_PUBLIC_MEDIA_BASE_URL
// (e.g. an R2 bucket URL) to serve them from somewhere else.
const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').replace(
  /\/+$/,
  ''
);

const VideoPlayer = ({
  name,
  id,
  width = '100%',
  height = '560px',
  title = 'Xmartlabs',
  style,
}) => {
  if (id) {
    return (
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={style}
      ></iframe>
    );
  }
  return (
    <video
      width={width}
      height={height}
      src={`${MEDIA_BASE_URL || '/images'}/${name}`}
      title={title}
      allowFullScreen
      controls={true}
      style={style}
    />
  );
};

export { VideoPlayer };
