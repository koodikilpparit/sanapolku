import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ImageContainer.css';
import ImagePreview from '../ImagePreview';

const ImageContainer = ({ src, alt, author }) => {
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

  return (
    <div className="image-container flex items-center justify-center sm:items-start p-4">
      <img
        className="h-full aspect-square bg-sp-white rounded-lg cursor-pointer"
        src={src}
        alt={alt}
        onClick={openPreview}
      />
      {isPreviewOpen && (
        <ImagePreview image={src} author={author} onClose={closePreview} />
      )}
    </div>
  );
};

ImageContainer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  author: PropTypes.string,
};

export default ImageContainer;
