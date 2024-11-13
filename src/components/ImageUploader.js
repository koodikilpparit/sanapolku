import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/NewWord.css';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Component that allows uploading images
const ImageUploader = ({ setImageData }) => {
  // State for uploaded images
  const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image for preview

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
      setUploadedImage(e.target.result); // Set the uploaded image for preview
      setImageData({ src: e.target.result, author: null }); // Pass the image data back to NewWord component
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
      {/* Preview uploaded image */}
      {uploadedImage ? (
        <img
          src={uploadedImage}
          alt="Esikatselu"
          className="image-placeholder"
        />
      ) : (
        <img
          src="https://placehold.co/150x150"
          alt="Placeholder"
          className="image-placeholder"
        />
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  setImageData: PropTypes.func.isRequired,
};

export default ImageUploader;
