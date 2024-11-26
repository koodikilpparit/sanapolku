import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageContainer from './ImageContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';

const Phase3 = ({
  currentWord,
  playerInput,
  handleInputChange,
  handleSubmit,
  inputRefs,
  incorrectIndices,
  inputDisabled,
  showContinueButton,
  handleContinueOnWrongAnswer,
  showSkipButton,
  handleSkip,
}) => {
  const isReadyButtonDisabled = playerInput.some((letter) => letter === '');

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, currentWord.word.length);
  }, [currentWord, inputRefs]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (showContinueButton) {
          handleContinueOnWrongAnswer();
        } else if (!isReadyButtonDisabled) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isReadyButtonDisabled,
    handleSubmit,
    handleContinueOnWrongAnswer,
    showContinueButton,
  ]);

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
      <div className="flex flex-col sm:flex-row md:flex-row md-minh-1000:flex-col md-minh-1000:items-center lg:flex-row h-full">
        <div className="w-full sm:w-2/5 md:w-1/2 h-2/5 sm:h-full">
          <ImageContainer
            src={currentWord.imageData.src}
            alt={`Kuva sanasta ${currentWord.word}`}
            className=""
            author={currentWord.imageData.author}
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
                  className={
                    'w-full aspect-square rounded-lg font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-sp-white text-sp-black p-1'
                  }
                  style={
                    incorrectIndices.includes(index)
                      ? {
                          backgroundColor: 'rgb(242 140 140)',
                          border: '4px solid rgb(227, 17, 48)',
                        }
                      : { backgroundColor: 'rgb(255 255 255)' }
                  }
                  autoCapitalize="none"
                  disabled={inputDisabled}
                />
              ))}
            </div>
          </div>

          <div className="flex items-end justify-center sm:justify-end py-2">
            {showSkipButton && (
              <button
                className="btn-sp-primary w-full sm:w-1/2 text-sp-white cursor-pointer"
                style={{
                  backgroundColor: '#F0D784',
                  color: '#013326',
                }}
                onClick={handleSkip}
              >
                OHITA
              </button>
            )}
            <button
              className="btn-sp-secondary sm:w-1/4 bg-sp-blue cursor-pointer"
              style={{ marginRight: '3%', marginLeft: '3%' }}
              onClick={() => inputRefs.current[0]?.focus()}
            >
              <FontAwesomeIcon icon={faKeyboard} className="keyboard" />
            </button>
            {showContinueButton ? (
              <button
                className="btn-sp-primary w-full sm:w-1/2 bg-sp-light-green cursor-pointer"
                onClick={handleContinueOnWrongAnswer}
              >
                JATKA
              </button>
            ) : (
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
            )}
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
  incorrectIndices: PropTypes.array,
  inputDisabled: PropTypes.bool,
  showContinueButton: PropTypes.bool,
  handleContinueOnWrongAnswer: PropTypes.func,
  showSkipButton: PropTypes.bool.isRequired,
  handleSkip: PropTypes.func.isRequired,
};

export default Phase3;
