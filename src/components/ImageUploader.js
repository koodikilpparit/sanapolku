import React from 'react';
import PropTypes from 'prop-types';
import '../styles/NewWord.css';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Component that allows uploading images
const ImageUploader = ({ onImageSelect }) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Checks the file type
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validFileTypes.includes(file.type)) {
      alert('Vain JPEG, JPG tai PNG tiedostot hyväksytään.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      onImageSelect({ src: e.target.result, author: null });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-button">
        <FontAwesomeIcon icon={faImage} className="image-icon" />
        Lataa kuva
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
};

ImageUploader.propTypes = {
  onImageSelect: PropTypes.func,
};

export default ImageUploader;
