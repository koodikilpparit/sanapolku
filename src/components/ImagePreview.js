import React from 'react';
import PropTypes from 'prop-types';
import './ImagePreview.css';
import { faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ImagePreview = ({ image, author, onClose }) => {
  const handleOverlayClick = (e) => {
    // Close the modal if the user clicks outside the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-preview-overlay" onClick={handleOverlayClick}>
      <div className="image-preview-container">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Sulje esikatselu"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlassMinus}
            className="button-icon"
          />
        </button>
        <img src={image} alt="Esikatselu" className="enlarged-image" />

        {/* Empty when author is null aka user's own image,
            "Tuntematon tekijä" when using Papunet image with no author */}
        {author && (
          <p className="image-author">
            Kuva: Papunetin kuvapankki, papunet.net,{' '}
            {author || 'Tuntematon tekijä'}
          </p>
        )}
      </div>
    </div>
  );
};

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
  author: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ImagePreview;
