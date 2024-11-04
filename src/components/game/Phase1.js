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
  const isReadyButtonDisabled = playerInput.some((letter) => letter === '');

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, currentWord.word.length);
  }, [currentWord, inputRefs]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !isReadyButtonDisabled) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReadyButtonDisabled, handleSubmit]);

  // Function to handle backspace key for navigating to the previous input
  const handleBackspaceNavigation = (index, event) => {
    if (event.key === 'Backspace' && index > 0 && playerInput[index] === '') {
      inputRefs.current[index - 1].focus();
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
                onChange={(event) => handleInputChange(index, event, inputRefs)}
                onKeyDown={(event) => handleBackspaceNavigation(index, event)}
                maxLength="1"
                className="letter-tile"
              />
            ))}
          </div>
          <button
            className="ph1-ready-button"
            onClick={handleSubmit}
            disabled={isReadyButtonDisabled}
            style={{
              backgroundColor: isReadyButtonDisabled ? 'grey' : '#72A895',
              cursor: isReadyButtonDisabled ? 'not-allowed' : 'pointer',
            }}
          >
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
