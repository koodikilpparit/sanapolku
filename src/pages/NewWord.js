import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addWord, getPathByName } from '../db/db';
import '../styles/NewWord.css';
import BackButton from '../components/universal/BackButton';
import ImageUploader from '../components/newWord/ImageUploader';
import Modal from '../components/Modal';
import PapunetView from './PapunetView';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NewWord = () => {
  const navigate = useNavigate();
  const { pathName } = useParams();
  const [newWord, setNewWord] = useState('');
  const [pathId, setPathId] = useState(null);
  const [error, setError] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Placeholder image
  const placeholderImage = {
    src: 'https://placehold.co/150x150',
    author: null,
  };

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

    const imageDataToSave = imageData || placeholderImage;

    if (pathId) {
      addWord(newWord, pathId, imageDataToSave)
        .then(() => navigate(-1))
        .catch(() => alert('Error saving the word.'));
    } else {
      alert('Path ID not found.');
    }
  };

  return (
    <div className="word-page">
      {/* Header */}
      <div className="new-word-header">
        <BackButton />
        <h2>Uusi sana</h2>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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
                src={imageData?.src || placeholderImage.src}
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
          onSelectImage={(image) => {
            setImageData(image);
            setIsModalOpen(false);
          }}
          initialSearchTerm={newWord}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default NewWord;
