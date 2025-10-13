import React from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ name, id, width, height, title, style }) => {
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
      src={`/images/${name}`}
      title={title}
      allowFullScreen
      controls={true}
      style={style}
    />
  );
};

VideoPlayer.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.object,
};

VideoPlayer.defaultProps = {
  width: '100%',
  height: '560px',
  title: 'Xmartlabs',
};

export { VideoPlayer };
