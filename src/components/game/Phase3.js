import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageContainer from './ImageContainer';

const Phase3 = ({
  currentWord,
  playerInput,
  handleInputChange,
  handleSubmit,
  inputRefs,
  showSkipButton,
  handleSkip,
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
    <div className="flex flex-col">
      <h1 className="text-sp-white text-4xl md:text-6xl lg:text-7xl font-bold py-2 md:py-4">
        Kopioi sana
      </h1>
      <div className="flex flex-col sm:flex-row h-full">
        <div className="w-full sm:w-2/5 md:w-1/2 h-2/5 sm:h-full">
          <ImageContainer
            src={currentWord.imageData.src}
            alt={`Kuva sanasta ${currentWord.word}`}
            className=""
          />
        </div>
        <div className="w-full sm:w-3/5 md:w-1/2 h-3/5 sm:h-full flex flex-col justify-between">
          <div className="flex flex-col gap-2 lg:gap-4">
            <div className="flex flex-row gap-1 md:gap-2 items-center justify-center px-2">
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
            <div className="flex flex-row gap-1 md:gap-2 items-center justify-center px-2">
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
                  className="w-full aspect-square rounded-lg font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-sp-white text-sp-black p-1"
                  autoCapitalize="none"
                />
              ))}
            </div>
          </div>

          <div className="flex items-end justify-center sm:justify-end py-5">
            {showSkipButton && (
              <button
                className="btn-sp-primary w-full sm:w-1/2 text-sp-white cursor-pointer"
                style={{
                  backgroundColor: '#F0D784',
                  color: '#013326',
                  marginRight: '20px',
                }}
                onClick={handleSkip}
              >
                SKIP
              </button>
            )}
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
    imageData: PropTypes.object.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  playerInput: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  inputRefs: PropTypes.object.isRequired,
  showSkipButton: PropTypes.bool.isRequired,
  handleSkip: PropTypes.func.isRequired,
};

export default Phase3;
