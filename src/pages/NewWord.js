import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { addWord, deleteWord, addPath } from '../db/db';
import '../styles/NewWord.css';
import BackButton from '../components/universal/BackButton';
import ImageUploader from '../components/newWord/ImageUploader';
import Modal from '../components/Modal';
import PapunetView from './PapunetView';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageCropper from '../components/newWord/ImageCropper';
import ImagePreview from '../components/ImagePreview';

const NewWord = () => {
  const navigate = useNavigate();
  const pathId = Number(useParams().pathId);
  const location = useLocation();
  const temporaryPathId = Number(useParams().pathId);
  const loadedWord = location.state?.wordEntry;
  const newPathName = location.state?.newPathName;

  const [newWord, setNewWord] = useState('');
  const [imageData, setImageData] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    'https://placehold.co/150x150'
  );
  const [isPapunetOpen, setIsPapunetOpen] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [isLargeImgPreviewOpen, setIsLargeImgPreviewOpen] = useState(false);
  const [largeImgPreview, setLargeImgPreview] = useState(null);

  // Placeholder image
  const placeholderImage = {
    src: 'https://placehold.co/150x150',
    author: null,
  };

  const maxWordLength = 15;

  // Set initial values if a word is provided as a status. This happens when editing a word
  useEffect(() => {
    if (loadedWord) {
      setNewWord(loadedWord.word || '');
      setImageData(loadedWord.imageData || null);
      setPreviewImage(
        loadedWord.imageData?.src || 'https://placehold.co/150x150'
      );
    }
  }, [loadedWord]);

  // Save the word and placeholder image to the database
  const handleSave = async () => {
    if (!newWord.trim()) {
      alert('Syötä sana');
      return;
    }

    // If the word is being edited, delete the old word first
    if (loadedWord) {
      deleteWord(loadedWord.id);
    }

    const imageDataToSave = imageData || placeholderImage;

    let pathId = temporaryPathId;
    if (newPathName) {
      pathId = await addPath(newPathName);
    }

    if (pathId) {
      try {
        await addWord(newWord, pathId, imageDataToSave);
        navigate('/muokkaapolkua/' + pathId);
      } catch (error) {
        alert('Error saving the word.');
      }
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
    setIsPapunetOpen(false); // Close Papunet modal as well
  };

  const handleImageSelection = (image, source) => {
    // Set the selected image and author from Papunet
    setImageData({
      src: image.src,
      author: image.author,
    });
    setImageSource(source);
    setIsCropping(true); // Open the cropping modal
  };

  const handleLargeImgPreview = (image) => {
    setLargeImgPreview(image);
    setIsLargeImgPreviewOpen(true);
  };

  const reopenFileSelector = () => {
    document.getElementById('hiddenFileInput').click();
  };

  return (
    <div className="word-page">
      {/* Header */}
      <div className="new-word-header">
        <BackButton url={'/muokkaapolkua/' + pathId} />
        <h2>{loadedWord ? `Muokkaat sanaa` : 'Uusi sana'}</h2>
      </div>

      {/* Container*/}
      <div className="new-word-container">
        {/* Add word */}
        <div className="input-container">
          <label>Kirjoita uusi sana</label>
          <div className="input-wrapper">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Uusi sana"
              maxLength={maxWordLength}
            />
            {/* Indicator for remaining characters */}
            <span
              className={`char-indicator ${
                newWord.length === maxWordLength ? 'warning' : ''
              }`}
            >
              {maxWordLength - newWord.length} kirjainta jäljellä
            </span>
          </div>

          {/* Upload image */}
          <div className="img-upload-container">
            <label>Lataa kuva</label>
            {/* Wrapper for upload and preview */}
            <div className="img-upload-preview-wrapper">
              <div className="img-upload-button-container">
                <ImageUploader
                  setImageData={handleImageSelection}
                  setImageSource={setImageSource}
                />
                <button
                  className="img-upload-button"
                  onClick={() => setIsPapunetOpen(true)}
                >
                  <FontAwesomeIcon icon={faImage} className="button-icon" />
                  <span className="button-text">Papunetistä</span>
                </button>
              </div>
              {/* Image Preview */}
              <div className="image-preview">
                <img src={previewImage} alt="Esikatselu" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirm-button-container">
          <button
            className="nw-cancel-button"
            onClick={() => navigate('/muokkaapolkua/' + temporaryPathId)}
          >
            PERUUTA
          </button>
          <button className="nw-save-button" onClick={handleSave}>
            VALMIS
          </button>
        </div>
      </div>

      {/* Modal for PapunetView */}
      <Modal
        isOpen={isPapunetOpen}
        modalType="papunet"
        onClose={() => setIsPapunetOpen(false)}
      >
        <PapunetView
          onSelectImage={handleImageSelection}
          initialSearchTerm={newWord}
          closeModal={() => setIsPapunetOpen(false)}
          setLargeImgPreview={handleLargeImgPreview}
        />
      </Modal>

      {/* Modal for Papunet Large Image Preview */}
      <Modal isOpen={isLargeImgPreviewOpen} modalType="image-preview">
        {largeImgPreview && (
          <ImagePreview
            image={largeImgPreview.src}
            author={largeImgPreview.author}
            onClose={() => setIsLargeImgPreviewOpen(false)}
          />
        )}
      </Modal>

      {/* Modal for Image Cropping */}
      <Modal isOpen={isCropping} modalType="image-cropper">
        {imageData && (
          <ImageCropper
            key={imageData.src}
            imageSrc={imageData.src}
            onCroppedImage={handleImageCrop}
            onBack={() => setIsCropping(false)}
            imageSource={imageSource}
            reopenFileSelector={reopenFileSelector}
          />
        )}
      </Modal>
    </div>
  );
};

export default NewWord;
