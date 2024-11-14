import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addWord } from '../db/db';
import '../styles/NewWord.css';
import BackButton from '../components/universal/BackButton';
import ImageUploader from '../components/ImageUploader';
import Modal from '../components/Modal';
import PapunetView from './PapunetView';
import ImageCropper from '../components/ImageCropper';

const NewWord = () => {
  const navigate = useNavigate();
  const pathId = Number(useParams().pathId);
  const [newWord, setNewWord] = useState('');
  const [imageData, setImageData] = useState(null);
  const [previewImage, setPreviewImage] = useState({
    src: 'https://placehold.co/150x150',
    author: 'Unknown',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCropping, setIsCropping] = useState(false); // Modal for image cropping

  // Function to fetch path ID when the component loads
  useEffect(() => {
    getPathByName(pathName)
      .then((path) => {
        if (path) {
          setPathId(path.id);
        } else {
          setError(`Path with the name "${pathName}" was not found.`);
        }
      })
      .catch(() => setError('Error fetching path'));
  }, [pathName]);

  // Function to save the word and placeholder image to the database
  const handleSave = () => {
    if (!newWord.trim()) {
      alert('Syötä sana');
      return;
    }

    const imageDataToSave = imageData || previewImage;

    if (pathId) {
      addWord(newWord, pathId, imageDataToSave)
        .then(() => navigate(-1))
        .catch(() => alert('Error saving the word.'));
    } else {
      alert('Path ID not found.');
    }
  };

  const handleImageCrop = (croppedImage) => {
    setImageData(croppedImage); // Set the cropped image
    setPreviewImage(croppedImage);
    setIsCropping(false); // Close the cropping modal
    setIsModalOpen(false); // Close Papunet modal as well
  };

  const handleImageSelection = (image) => {
    setImageData(image); // Set the selected image from Papunet
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
          <label>Kirjoita uusi sana:</label>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Uusi sana"
          />
        </div>

        {/* Container for ImageUploader and preview image */}
        <div className="image-upload-preview-container">
          {/* Upload image */}
          <ImageUploader
            setImageData={setImageData}
            onImageSelect={handleImageSelection}
            setIsCropping={setIsCropping}
          />

          {/* Image preview */}
          <img src={previewImage} alt="Preview" className="image-preview" />
        </div>

        {/* Buttons */}
        <div className="confirm-button-container">
          <button className="nw-cancel-button" onClick={() => navigate(-1)}>
            PERUUTA
          </button>
          <button className="nw-save-button" onClick={handleSave}>
            VALMIS
          </button>
          <button
            className="nw-fetch-photos-button"
            onClick={() => setIsModalOpen(true)}
          >
            HAE KUVIA
          </button>
        </div>
      </div>

      {/* Modal for PapunetView */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PapunetView
          onSelectImage={handleImageSelection}
          initialSearchTerm={newWord}
        />
      </Modal>

      {/* Modal for Image Cropping */}
      <Modal
        isOpen={isCropping}
        onClose={() => setIsCropping(false)}
        modalType="image-cropper"
        showCloseButton={false}
      >
        <ImageCropper imageSrc={imageData} onCroppedImage={handleImageCrop} />
      </Modal>
    </div>
  );
};

export default NewWord;
