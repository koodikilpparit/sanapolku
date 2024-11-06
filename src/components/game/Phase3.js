import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageContainer from './ImageContainer';

const Phase3 = ({
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
    <div className="flex flex-col mt-2">
      <h1 className="text-sp-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
        Kopioi sana
      </h1>
      <div className="flex flex-col sm:flex-row mt-8 w-full">
        <div className="w-full sm:w-1/2 flex items-center justify-center">
          <ImageContainer
            src={currentWord.img}
            alt={`Kuva sanasta ${currentWord.word}`}
            className=""
          />
        </div>
        <div className="w-full sm:w-1/2 gap-16 sm:gap-0 flex flex-col mt-8 sm:mt-0 px-4 sm:px-0">
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="flex gap-1 w-full">
              {currentWord.word
                .toUpperCase()
                .split('')
                .map((letter, index) => (
                  <div
                    key={index}
                    className="w-full aspect-square rounded-lg font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-sp-white text-sp-black p-1 flex items-center justify-center"
                  >
                    {letter}
                  </div>
                ))}
            </div>
            <div className="flex gap-1 w-full">
              {currentWord.word.split('').map((_, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={playerInput[index] || ''}
                  onChange={(event) =>
                    handleInputChange(index, event, inputRefs)
                  }
                  onKeyDown={(event) => handleBackspaceNavigation(index, event)}
                  maxLength="1"
                  className="w-full aspect-square rounded-lg font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-sp-white text-sp-black p-1 flex items-center justify-center"
                />
              ))}
            </div>
          </div>

          <div className="mt-auto flex justify-end">
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

Phase3.propTypes = {
  currentWord: PropTypes.shape({
    img: PropTypes.string.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  playerInput: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  inputRefs: PropTypes.object.isRequired,
};

export default Phase3;
