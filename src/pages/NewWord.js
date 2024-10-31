import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addWord, getPathByName } from '../db/db';
import '../styles/NewWord.css';
import BackButton from '../components/universal/BackButton';
import ImageUploader from '../components/ImageUploader';
import Modal from '../components/Modal';
import PhotoFetcher from './Papunet';

const NewWord = () => {
  const navigate = useNavigate();
  const { pathName } = useParams();
  const [newWord, setNewWord] = useState('');
  const [pathId, setPathId] = useState(null);
  const [error, setError] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Placeholder image URL
  const placeholderImage = 'https://placehold.co/150x150';

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

    const imageToSave = imageData || placeholderImage;

    if (pathId) {
      addWord(newWord, pathId, imageToSave)
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
        <div className="button-container">
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

      {/* Modal for PhotoFetcher */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PhotoFetcher />
      </Modal>
    </div>
  );
};

export default NewWord;
