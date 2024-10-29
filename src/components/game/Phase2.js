import React from 'react';
import PropTypes from 'prop-types';

const Phase2 = ({
  currentWord,
  shuffledWord,
  playerInput,
  handleInputChange,
  handleSubmit,
}) => (
  <div>
    <h1>Järjestä kirjaimet</h1>
    <img src={currentWord.img} alt={`Kuva sanasta ${currentWord.word}`} />
    <p>{shuffledWord.toUpperCase()}</p>
    <div className="submit-word-div">
      <label htmlFor="player-input">Syötä sana:</label>
      <input
        id="player-input"
        type="text"
        value={playerInput}
        onChange={handleInputChange}
        placeholder="Syötä sana"
      />
      <button onClick={handleSubmit}>Valmis</button>
    </div>
  </div>
);

Phase2.propTypes = {
  currentWord: PropTypes.shape({
    img: PropTypes.string.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  shuffledWord: PropTypes.string.isRequired,
  playerInput: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Phase2;
