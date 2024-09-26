import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewWord = () => {
  const navigate = useNavigate();
  const [newWord, setNewWord] = useState('');
  const [imageAdded, setImageAdded] = useState(false); // Track if image is added

  // Function to handle saving the word
  const handleSave = () => {
    // Logic to save the word and image, if added
    console.log('Word saved:', newWord, imageAdded ? 'with image' : 'no image');
    navigate(-1); // Go back after saving
  };

  return (
    <div>
      {/* Back button */}
      <button onClick={() => navigate(-1)}>Takaisin</button>

      {/* Title */}
      <h2>Uusi sana</h2>

      {/* Input for new word */}
      <label>Kirjoita uusi sana:</label>
      <input
        type="text"
        value={newWord}
        onChange={(e) => setNewWord(e.target.value)}
        placeholder=""
      />

      {/* Checkbox for adding an image */}
      <div>
        <input
          type="checkbox"
          checked={imageAdded}
          onChange={(e) => setImageAdded(e.target.checked)}
        />
        <label>Lisää kuva</label>
      </div>

      {/* Image placeholder */}
      {imageAdded && (
        <div>
          <img src="/mrBean.png" alt="Placeholder" width="100" height="100" />
        </div>
      )}

      {/* Buttons for Cancel and Save */}
      <button onClick={() => navigate(-1)}>Peruuta</button>
      <button onClick={handleSave}>Valmis</button>
    </div>
  );
};

export default NewWord;