import React from 'react';
import PropTypes from 'prop-types';
import './ImagePreview.css';

const ImagePreview = ({ image, author, onClose }) => (
  <div className="image-preview-container">
    <button className="close-btn" onClick={onClose} aria-label="Close Preview">
      ✖
    </button>
    <img src={image} alt="Preview" className="enlarged-image" />
    {author && <p className="image-author">Tekijä: {author}</p>}
  </div>
);

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
  author: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ImagePreview;
