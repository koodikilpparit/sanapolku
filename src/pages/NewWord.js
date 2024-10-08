import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addWord, getPathByName } from '../db/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import '../styles/NewWord.css';
import BackButton from '../components/universal/BackButton';

const NewWord = () => {
  const navigate = useNavigate();
  const { pathName } = useParams();
  const [newWord, setNewWord] = useState('');
  const [pathId, setPathId] = useState(null);
  const [error, setError] = useState(null);

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
      alert("Syötä sana");
      return;
    }

    if (pathId) {
      addWord(newWord, pathId, placeholderImage)
        .then(() => navigate(-1))
        .catch(() => alert("Error saving the word."));
    } else {
      alert("Path ID not found.");
    }
  };

  return (
    <div className="word-page">

      {/* Header */}
      <div className="new-word-header">
        <BackButton />
        <h2 className="title">Uusi sana</h2>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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

      {/* Add image */}
      <div className="image-upload-container">
        <button className="image-upload-button">
          <FontAwesomeIcon icon={faImage} className="image-icon" />
          Lisää kuva
        </button>
        <img src={placeholderImage} alt="Placeholder" className="image-placeholder" />
      </div>

      {/* Buttons */}
      <div className="button-container">
        <button className="cancel-button" onClick={() => navigate(-1)}>PERUUTA</button>
        <button className="save-button" onClick={handleSave}>TALLENNA</button>
      </div>
    </div>
  );
};

export default NewWord;