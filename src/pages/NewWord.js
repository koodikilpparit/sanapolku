import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addSana, getPolkuByName } from '../db/db';
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

  // Placeholder kuvan URL
  const placeholderImage = '/mrBean.png';

  // Funktio joka hakee polun ID:n kun komponentti latautuu
  useEffect(() => {
    getPolkuByName(pathName)
      .then((polku) => {
        if (polku) {
          setPathId(polku.id);
        } else {
          setError(`Polkua nimellä "${pathName}" ei löytynyt.`);
        }
      })
      .catch(() => setError('Virhe polun haussa'));
  }, [pathName]);

  // Funktio joka tallentaa sanan ja placeholder kuvan tietokantaan
  const handleSave = () => {
    if (!newWord.trim()) {
      alert("Syötä sana.");
      return;
    }

    if (pathId) {
      addSana(newWord, pathId, placeholderImage)
        .then(() => navigate(-1))
        .catch(() => alert("Virhe sanan tallentamisessa."));
    } else {
      alert("Polun ID:tä ei löytynyt.");
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

      {/* Input field for the new word */}
      <div className="input-container"><
        label>Kirjoita uusi sana:</label>
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Kirjoita sana"
        />
      </div>

      {/* Image upload and placeholder */}
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
        <button className="save-button" onClick={handleSave}>VALMIS</button>
      </div>
    </div>
  );
};

export default NewWord;