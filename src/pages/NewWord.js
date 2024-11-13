import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addWord } from '../db/db';
import '../styles/NewWord.css';
import BackButton from '../components/universal/BackButton';
import ImageUploader from '../components/ImageUploader';
import Modal from '../components/Modal';
import PapunetView from './PapunetView';

const NewWord = () => {
  const navigate = useNavigate();
  const pathId = Number(useParams().pathId);
  const [newWord, setNewWord] = useState('');
  const [imageData, setImageData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Placeholder image
  const placeholderImage = {
    src: 'https://placehold.co/150x150',
    author: 'Unknown',
  };

  // Function to save the word and placeholder image to the database
  const handleSave = () => {
    if (!newWord.trim()) {
      alert('Syötä sana');
      return;
    }

    const imageToSave = imageData || placeholderImage;

    if (pathId) {
      addWord(newWord, pathId, { src: imageToSave, author: null })
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

        {/* Upload image */}
        <ImageUploader setImageData={setImageData} />

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
          onSelectImage={(image) => {
            setImageData(image);
            setIsModalOpen(false);
          }}
          initialSearchTerm={newWord}
        />
      </Modal>
    </div>
  );
};

export default NewWord;
