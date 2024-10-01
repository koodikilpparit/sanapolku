import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addSana, getPolkuByName } from '../db/db';

const NewWord = () => {
  const navigate = useNavigate();
  const { pathName } = useParams();
  const [newWord, setNewWord] = useState('');
  const [pathId, setPathId] = useState(null);
  const [error, setError] = useState(null);

  // Placeholder image URL (can be any placeholder image)
  const placeholderImage = '/mrBean.png'; // Replace this with the path to your placeholder image

  // Fetch the path ID when the component loads
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

  // Function to save the word and the placeholder image to the database
  const handleSave = () => {
    if (!newWord.trim()) {
      alert("Syötä sana.");
      return;
    }

    if (pathId) {
      addSana(newWord, pathId, placeholderImage) // Use the placeholder image
        .then(() => navigate(-1)) // Navigate back on success
        .catch(() => alert("Virhe sanan tallentamisessa."));
    } else {
      alert("Polun ID:tä ei löytynyt.");
    }
  };

  return (
    <div>
      <button onClick={() => navigate(-1)}>Takaisin</button>
      <h2>Uusi sana polkuun: {pathName}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>Kirjoita uusi sana:</label>
      <input
        type="text"
        value={newWord}
        onChange={(e) => setNewWord(e.target.value)}
        placeholder="Kirjoita sana"
      />

      <button onClick={handleSave}>Valmis</button>
    </div>
  );
};

export default NewWord;