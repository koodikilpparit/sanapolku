import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import ImageContainer from './ImageContainer';

const Phase2 = ({
  currentWord,
  shuffledWord,
  handleSubmit,
  playerInput,
  setPlayerInput,
  incorrectIndices,
  inputDisabled,
  showContinueButton,
  handleContinueOnWrongAnswer,
  showSkipButton,
  handleSkip,
}) => {
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const lettersArray = shuffledWord
      .toUpperCase()
      .split('')
      .map((letter, index) => ({
        letter,
        isUsed: false,
        id: index,
      }));

    setPlayerInput(Array(currentWord.word.length).fill(''));
    setShuffledLetters(lettersArray);
    setSelectedLetter(null);
  }, [currentWord, shuffledWord, setPlayerInput]);

  const isReadyButtonDisabled = playerInput.includes('');

  const handleLetterClick = (event, letter, index) => {
    if (inputDisabled) return;
    event.stopPropagation();
    if (!shuffledLetters[index].isUsed) {
      if (selectedLetter && selectedLetter.index === index) {
        setSelectedLetter(null);
      } else {
        setSelectedLetter({ letter, index });
      }
    }
  };

  const handleInputClick = (event, index) => {
    if (inputDisabled) return;
    event.stopPropagation();
    const newPlayerInput = [...playerInput];
    const newShuffledLetters = [...shuffledLetters];

    if (selectedLetter) {
      const { letter, index: lowerIndex } = selectedLetter;

      if (newPlayerInput[index] !== '') {
        const letterToRemove = newPlayerInput[index];
        const letterIndex = shuffledLetters.findIndex(
          (item) => item.letter === letterToRemove && item.isUsed
        );
        if (letterIndex !== -1) {
          newShuffledLetters[letterIndex].isUsed = false;
        }
      }

      newPlayerInput[index] = letter;
      newShuffledLetters[lowerIndex].isUsed = true;
      setPlayerInput(newPlayerInput);
      setShuffledLetters(newShuffledLetters);
      setSelectedLetter(null);
    } else {
      if (newPlayerInput[index] !== '') {
        const letterToRemove = newPlayerInput[index];
        const letterIndex = shuffledLetters.findIndex(
          (item) => item.letter === letterToRemove && item.isUsed
        );
        if (letterIndex !== -1) {
          newShuffledLetters[letterIndex].isUsed = false;
        }
        newPlayerInput[index] = '';
        setPlayerInput(newPlayerInput);
        setShuffledLetters(newShuffledLetters);
      }
    }
  };

  const handleContainerClick = () => {
    if (selectedLetter) {
      setSelectedLetter(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (showContinueButton) {
          handleContinueOnWrongAnswer();
        } else if (!isReadyButtonDisabled) {
          handleSubmit(playerInput.join(''));
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
    playerInput,
    handleContinueOnWrongAnswer,
    showContinueButton,
  ]);

  const displayShuffledLetters = () => {
    const unusedLetters = shuffledLetters.filter((item) => !item.isUsed);
    const blanksCount = shuffledLetters.length - unusedLetters.length;
    const blanks = Array(blanksCount).fill({
      letter: '',
      id: null,
      isBlank: true,
    });

    return [...unusedLetters, ...blanks];
  };

  return (
    <div
      className="flex flex-col"
      onClick={handleContainerClick}
      ref={containerRef}
    >
      <h1 className="text-sp-white text-4xl md:text-6xl lg:text-7xl font-bold py-2 md:py-4">
        Järjestä kirjaimet
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
        <div className="w-full sm:w-4/5 md:w-4/5 h-3/5 flex flex-col justify-between">
          <div className="flex flex-col gap-2 lg:gap-4">
            <div className="flex flex-row gap-1 items-center justify-center px-2">
              {playerInput.map((letter, index) => (
                <div
                  key={index}
                  onClick={(event) => handleInputClick(event, index)}
                  className={`w-full aspect-square rounded-lg font-bold text-center text-sp-black p-0 max-w-20 sm:max-w-24 md:max-w-28 lg:max-w-32 text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl ${
                    incorrectIndices.includes(index)
                      ? 'bg-[#F28C8C] border-4 border-[#E31130]'
                      : letter !== ''
                        ? 'bg-sp-white text-sp-black'
                        : 'bg-sp-gray text-sp-black opacity-50 border-2 border-sp-white'
                  } p-1 flex items-center justify-center cursor-pointer`}
                  data-testid="input-box"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="flex flex-row gap-1 items-center justify-center px-2">
              {displayShuffledLetters().map((item, index) => (
                <div
                  key={index}
                  onClick={
                    inputDisabled || item.isBlank
                      ? undefined
                      : (event) =>
                          handleLetterClick(event, item.letter, item.id)
                  }
                  className={`w-full aspect-square flex items-center justify-center rounded-lg font-bold text-center text-sp-black p-0 max-w-20 sm:max-w-24 md:max-w-28 lg:max-w-32 text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl${
                    item.isBlank
                      ? 'bg-sp-dark-green cursor-default'
                      : 'cursor-pointer bg-sp-white border-2 ' +
                        (selectedLetter && selectedLetter.index === item.id
                          ? 'bg-sp-light-yellow border-sp-light-yellow'
                          : 'border-sp-white')
                  }`}
                  data-testid="shuffled-letter"
                >
                  {item.letter}
                </div>
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
                  marginRight: '20px',
                }}
                onClick={handleSkip}
              >
                OHITA
              </button>
            )}
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
                onClick={() => handleSubmit(playerInput.join(''))}
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

Phase2.propTypes = {
  currentWord: PropTypes.shape({
    imageData: PropTypes.object.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  shuffledWord: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  playerInput: PropTypes.array.isRequired,
  setPlayerInput: PropTypes.func.isRequired,
  incorrectIndices: PropTypes.array,
  inputDisabled: PropTypes.bool,
  showContinueButton: PropTypes.bool,
  handleContinueOnWrongAnswer: PropTypes.func,
  showSkipButton: PropTypes.bool.isRequired,
  handleSkip: PropTypes.func.isRequired,
};

export default Phase2;
