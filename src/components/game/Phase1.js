import React from 'react';
import PropTypes from 'prop-types';
import LetterTile from '../start/LetterTile';
import { useEffect } from 'react';
import './Phase1.css';

const Phase1 = ({
  currentWord,
  handleSubmit,
  playerInput,
  setPlayerInput,
  activeIndex,
  setActiveIndex,
}) => {
  useEffect(() => {
    setPlayerInput(Array(currentWord.word.length).fill(''));
    setActiveIndex(0);
  }, [currentWord, setActiveIndex, setPlayerInput]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (activeIndex < playerInput.length && key.length === 1) {
        const newInput = [...playerInput];
        newInput[activeIndex] = key.toUpperCase();
        setPlayerInput(newInput);
        setActiveIndex(activeIndex + 1);
      } else if (key === 'Backspace' && activeIndex > 0) {
        const newInput = [...playerInput];
        newInput[activeIndex - 1] = '';
        setPlayerInput(newInput);
        setActiveIndex(activeIndex - 1);
      } else if (key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerInput, activeIndex, setPlayerInput, setActiveIndex, handleSubmit]);

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
              <LetterTile key={index} letter={playerInput[index] || ''} />
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
  handleSubmit: PropTypes.func.isRequired,
  playerInput: PropTypes.array.isRequired,
  setPlayerInput: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
};

export default Phase1;
