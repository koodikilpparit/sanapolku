import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/NewWord.css';
import { faTabletScreenButton } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Component that allows uploading images
const ImageUploader = ({ setImageData, setImageSource }) => {
  const [imageKey, setImageKey] = useState(0);

  const handleFileUpload = (event) => {
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
      setImageData({ src: e.target.result, author: null });
      setImageSource('device');
      setImageKey((prevKey) => prevKey + 1);
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
        key={imageKey}
      />
    </div>
  );
};

ImageUploader.propTypes = {
  setImageData: PropTypes.func,
  setImageSource: PropTypes.func,
};

export default ImageUploader;
