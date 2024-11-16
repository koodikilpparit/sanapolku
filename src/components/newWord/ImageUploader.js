import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/NewWord.css';
import { faTabletScreenButton } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Component that allows uploading images
const ImageUploader = ({ setImageData }) => {
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
      setImageData({ src: e.target.result, author: null }); // Pass the image data back to NewWord component
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    document.getElementById('hiddenFileInput').click();
  };

  return (
    <div>
      <button className="img-upload-button" onClick={handleButtonClick}>
        <FontAwesomeIcon icon={faTabletScreenButton} className="button-icon" />
        <span className="button-text">Laitteelta</span>
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="hiddenFileInput"
      />
    </div>
  );
};

ImageUploader.propTypes = {
  setImageData: PropTypes.func.isRequired,
};

export default ImageUploader;
