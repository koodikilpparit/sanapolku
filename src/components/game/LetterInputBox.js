import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const LetterInputBox = ({ currentWord, playerInput, setPlayerInput }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    setPlayerInput(Array(currentWord.word.length).fill(''));
    setActiveIndex(0);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  }, [currentWord, setPlayerInput]);

  const handleInputChange = (event) => {
    const value = event.target.value.toUpperCase();
    if (
      activeIndex !== null &&
      value &&
      activeIndex < currentWord.word.length
    ) {
      const newPlayerInput = [...playerInput];
      newPlayerInput[activeIndex] = value.slice(-1);
      setPlayerInput(newPlayerInput);
      event.target.value = '';

      if (activeIndex + 1 < currentWord.word.length) {
        setActiveIndex(activeIndex + 1);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const newPlayerInput = [...playerInput];

      if (playerInput[activeIndex] !== '') {
        newPlayerInput[activeIndex] = '';
        setPlayerInput(newPlayerInput);
      } else if (activeIndex > 0) {
        setActiveIndex((prevIndex) => prevIndex - 1);
        newPlayerInput[activeIndex - 1] = '';
        setPlayerInput(newPlayerInput);
      }
    }
  };

  const handleLetterBoxClick = (index) => {
    setActiveIndex(index);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };

  return (
    <div
      className="flex flex-row gap-1 md:gap-2 items-center justify-center py-4 px-2"
      onClick={() => inputRef.current?.focus()}
    >
      {currentWord.word.split('').map((_, index) => (
        <div
          key={index}
          onClick={() => handleLetterBoxClick(index)}
          className={`w-full aspect-square rounded-lg font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl p-1 flex items-center justify-center cursor-pointer ${
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
        data-testid="hidden-input"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{
          opacity: 0,
          width: 1,
          height: 1,
          position: 'absolute',
          pointerEvents: 'none',
        }}
        autoFocus
      />
    </div>
  );
};

LetterInputBox.propTypes = {
  currentWord: PropTypes.shape({
    word: PropTypes.string.isRequired,
  }).isRequired,
  playerInput: PropTypes.array.isRequired,
  setPlayerInput: PropTypes.func.isRequired,
};

export default LetterInputBox;
