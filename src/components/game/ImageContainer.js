import React from 'react';
import PropTypes from 'prop-types';
import './ImageContainer.css';

const ImageContainer = ({ src, alt }) => (
  <div className="image-container flex items-center justify-center sm:items-start p-4">
    <img className="h-full aspect-square" src={src} alt={alt} />
  </div>
);

ImageContainer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ImageContainer;
