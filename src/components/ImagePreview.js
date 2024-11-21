import React from 'react';
import PropTypes from 'prop-types';
import './ImagePreview.css';
import { faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ImagePreview = ({ image, author, onClose }) => (
  <div className="image-preview-container">
    <button
      className="close-btn"
      onClick={onClose}
      aria-label="Sulje esikatselu"
    >
      <FontAwesomeIcon icon={faMagnifyingGlassMinus} className="button-icon" />
    </button>
    <img src={image} alt="Preview" className="enlarged-image" />
    <p className="image-author">
      Kuva: Papunetin kuvapankki, papunet.net,{' '}
      {author ? author : 'Tuntematon tekijä'}
    </p>
  </div>
);

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
  author: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default ImagePreview;
