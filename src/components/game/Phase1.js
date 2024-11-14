import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ImageContainer from './ImageContainer';

const Phase1 = ({ currentWord, playerInput, setPlayerInput, handleSubmit }) => {
  const isReadyButtonDisabled =
    playerInput.length !== currentWord.word.length || playerInput.includes('');
  const inputRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setPlayerInput(Array(currentWord.word.length).fill(''));
    setActiveIndex(0);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [currentWord, setPlayerInput]);

  const handleInputChange = (event) => {
    const value = event.target.value.toUpperCase();
    if (activeIndex !== null && value) {
      // Accept input and overwrite
      const newPlayerInput = [...playerInput];
      newPlayerInput[activeIndex] = value.slice(-1);
      setPlayerInput(newPlayerInput);
      event.target.value = '';

      const nextIndex = activeIndex + 1;
      if (nextIndex < currentWord.word.length) {
        setActiveIndex(nextIndex);
      } else {
        setActiveIndex(currentWord.word.length - 1);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (activeIndex !== null) {
        const newPlayerInput = [...playerInput];

        if (playerInput[activeIndex] !== '') {
          // Delete the current letter
          newPlayerInput[activeIndex] = '';
          setPlayerInput(newPlayerInput);
        } else if (activeIndex > 0) {
          // Move to the previous box
          setActiveIndex(activeIndex - 1);
        }
      }
    }
  };

  const handleLetterBoxClick = (index) => {
    setActiveIndex(index);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleInputBlur = () => {
    // Allow user to unfocus the letter box
    setActiveIndex(null);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-sp-white text-4xl md:text-6xl lg:text-7xl font-bold py-2 md:py-4">
        Kirjoita sana
      </h1>

      <div className="flex flex-col sm:flex-row h-full ">
        <div className="w-full sm:w-2/5 md:w-1/2 h-2/5 sm:h-full ">
          <ImageContainer
            src={currentWord.imageData.src}
            alt={`Kuva sanasta ${currentWord.word}`}
          />
        </div>

        <div className="w-full sm:w-3/5 md:w-1/2 h-3/5 flex flex-col justify-between ">
          <div className="flex flex-row gap-1 md:gap-2 items-center justify-center py-4 px-2">
            {currentWord.word.split('').map((_, index) => (
              <div
                key={index}
                onClick={() => handleLetterBoxClick(index)}
                className={`w-full max-w-20 sm:max-w-24 md:max-w-28 lg:max-w-32 aspect-square rounded-lg font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl p-1 flex items-center justify-center cursor-pointer ${
                  activeIndex === index ? 'bg-sp-light-yellow' : 'bg-sp-white'
                }`}
                data-testid="input-box"
              >
                {playerInput[index] || ''}
              </div>
            ))}
            <input
              type="text"
              ref={inputRef}
              onChange={handleInputChange}
              data-testid="hidden-input"
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              style={{
                opacity: 0,
                position: 'absolute',
                pointerEvents: 'none',
              }}
              autoFocus
            />
          </div>
          <div className="flex items-end justify-center sm:justify-end  py-2">
            <button
              className={`btn-sp-primary w-full sm:w-1/2 ${
                isReadyButtonDisabled
                  ? 'bg-sp-gray cursor-not-allowed'
                  : 'bg-sp-light-green cursor-pointer'
              }`}
              onClick={handleSubmit}
              disabled={isReadyButtonDisabled}
            >
              VALMIS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Phase1.propTypes = {
  currentWord: PropTypes.shape({
    imageData: PropTypes.object.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  playerInput: PropTypes.array.isRequired,
  setPlayerInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Phase1;
