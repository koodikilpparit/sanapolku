import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Phase1.css';

const Phase1 = ({
  currentWord,
  playerInput,
  handleInputChange,
  handleSubmit,
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, currentWord.word.length);
    
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentWord, handleSubmit]);

  const handleChange = (index, event) => {
    const { value } = event.target;
    handleInputChange(index, event);

    if (value) {
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

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
                onChange={(event) => handleChange(index, event)}
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
};

export default Phase1;
