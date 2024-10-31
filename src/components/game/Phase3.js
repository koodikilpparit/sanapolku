import React from 'react';
import PropTypes from 'prop-types';

const Phase3 = ({
  currentWord,
  playerInput,
  handleInputChange,
  handleSubmit,
}) => (
  <div>
    <h1>Kopioi sana</h1>
    <img src={currentWord.img} alt={`Kuva sanasta ${currentWord.word}`} />
    <p>{currentWord.word.toUpperCase()}</p>
    <div className="submit-word-div">
      <label htmlFor="player-input">Syötä sana:</label>
      <input
        id="player-input"
        type="text"
        value={playerInput.join('')}
        onChange={handleInputChange}
        placeholder="Syötä sana"
      />
      <button onClick={handleSubmit}>Valmis</button>
    </div>
  </div>
);

Phase3.propTypes = {
  currentWord: PropTypes.shape({
    img: PropTypes.string.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  playerInput: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Phase3;
