import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addWord } from '../db/db';
import '../styles/NewWord.css';
import BackButton from '../components/universal/BackButton';
import ImageUploader from '../components/newWord/ImageUploader';
import Modal from '../components/Modal';
import PapunetView from './PapunetView';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageCropper from '../components/newWord/ImageCropper';

const NewWord = () => {
  const navigate = useNavigate();
  const pathId = Number(useParams().pathId);
  const [newWord, setNewWord] = useState('');
  const [imageData, setImageData] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    'https://placehold.co/150x150'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCropping, setIsCropping] = useState(false); // Modal for image cropping

  // Placeholder image
  const placeholderImage = {
    src: 'https://placehold.co/150x150',
    author: null,
  };

  // Function to save the word and placeholder image to the database
  const handleSave = () => {
    if (!newWord.trim()) {
      alert('Syötä sana');
      return;
    }

    const imageDataToSave = imageData || placeholderImage;

    if (pathId) {
      addWord(newWord, pathId, imageDataToSave)
        .then(() => navigate(-1))
        .catch(() => alert('Error saving the word.'));
    } else {
      alert('Path ID not found.');
    }
  };

  const handleImageCrop = (croppedImage) => {
    const newImageData = {
      src: croppedImage,
      author: imageData?.author,
    };
    setImageData(newImageData); // Set the cropped image
    setPreviewImage(croppedImage);
    setIsCropping(false); // Close the cropping modal
    setIsModalOpen(false); // Close Papunet modal as well
  };

  const handleImageSelection = (image) => {
    // Set the selected image and author from Papunet
    setImageData({
      src: image.src,
      author: image.author,
    });
    setIsCropping(true); // Open the cropping modal
  };

  return (
    <div className="word-page">
      {/* Header */}
      <div className="new-word-header">
        <BackButton />
        <h2>Uusi sana</h2>
      </div>

      {/* Container*/}
      <div className="new-word-container">
        {/* Add word */}
        <div className="input-container">
          <label>Kirjoita uusi sana</label>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Uusi sana"
          />

          {/* Upload image */}
          <div className="img-upload-preview-wrapper">
            <div className="img-upload-container">
              <label>Lataa kuva</label>
              <div className="img-upload-button-container">
                <ImageUploader setImageData={setImageData} />
                <button
                  className="img-upload-button"
                  onClick={() => setIsModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faImage} className="button-icon" />
                  <span className="button-text">Papunetistä</span>
                </button>
              </div>
            </div>

            {/* Image Preview */}
            <div className="image-preview">
              <img
                src={previewImage}
                alt="Esikatselu"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="confirm-button-container">
          <button className="nw-cancel-button" onClick={() => navigate(-1)}>
            PERUUTA
          </button>
          <button className="nw-save-button" onClick={handleSave}>
            VALMIS
          </button>
        </div>
      </div>

      {/* Modal for PapunetView */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PapunetView
          onSelectImage={handleImageSelection}
          initialSearchTerm={newWord}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Modal for Image Cropping */}
      <Modal
        isOpen={isCropping}
        onClose={() => setIsCropping(false)}
        modalType="image-cropper"
        showCloseButton={false}
      >
        {imageData && (
          <ImageCropper
            imageSrc={imageData?.src}
            onCroppedImage={handleImageCrop}
          />
        )}
      </Modal>
    </div>
  );
};

export default NewWord;
