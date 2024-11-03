import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Phase1.css';

const Phase1 = ({
  currentWord,
  playerInput,
  handleInputChange,
  handleSubmit,
  inputRefs,
}) => {
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, currentWord.word.length);
  }, [currentWord, inputRefs]);

  return (
    <div className="phase1-container">
      <h1>Kirjoita sana</h1>
      <div className="game-components">
        <div className="image-container">
          <img src={currentWord.img} alt={`Kuva sanasta ${currentWord.word}`} />
        </div>
        <div className="interactive-components">
          <div className="letter-tiles">
            {currentWord.word.split('').map((_, index) => (
              <input
                key={index}
                type="text"
                ref={(el) => (inputRefs.current[index] = el)}
                value={playerInput[index] || ''}
                onChange={(event) => handleInputChange(index, event, inputRefs)}
                maxLength="1"
                className="letter-tile"
              />
            ))}
          </div>
          <button className="ph1-ready-button" onClick={handleSubmit}>
            VALMIS
          </button>
        </div>
      </div>
    </div>
  );
};

Phase1.propTypes = {
  currentWord: PropTypes.shape({
    img: PropTypes.string.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  playerInput: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  inputRefs: PropTypes.object.isRequired,
};

export default Phase1;
