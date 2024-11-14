import React from 'react';
import PropTypes from 'prop-types';
import ImageContainer from './ImageContainer';
import LetterInputBox from './LetterInputBox';

const Phase2 = ({
  currentWord,
  playerInput,
  setPlayerInput,
  handleSubmit,
  shuffledWord,
}) => {
  const isReadyButtonDisabled =
    playerInput.length !== currentWord.word.length || playerInput.includes('');

  return (
    <div className="flex flex-col">
      <h1 className="text-sp-white text-4xl md:text-6xl lg:text-7xl font-bold py-2 md:py-4">
        Järjestä kirjaimet
      </h1>
      <div className="flex flex-col sm:flex-row h-full">
        <div className="w-full sm:w-2/5 md:w-1/2 h-2/5 sm:h-full">
          <ImageContainer
            src={currentWord.imageData.src}
            alt={`Kuva sanasta ${currentWord.word}`}
          />
        </div>
        <div className="w-full sm:w-3/5 md:w-1/2 h-3/5 flex flex-col justify-between">
          <div className="flex flex-row gap-1 md:gap-2 items-center justify-center px-2">
            {shuffledWord
              .toUpperCase()
              .split('')
              .map((letter, index) => (
                <div
                  key={index}
                  className="w-full aspect-square rounded-lg font-bold text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl bg-sp-white text-sp-black p-1 flex items-center justify-center"
                  data-testid="display-shuffled-letter-box"
                >
                  {letter}
                </div>
              ))}
          </div>
          <LetterInputBox
            currentWord={currentWord}
            playerInput={playerInput}
            setPlayerInput={setPlayerInput}
            handleSubmit={handleSubmit}
          />
          <div className="flex items-end justify-center sm:justify-end py-5">
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

Phase2.propTypes = {
  currentWord: PropTypes.shape({
    imageData: PropTypes.object.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  shuffledWord: PropTypes.string.isRequired,
  playerInput: PropTypes.array.isRequired,
  setPlayerInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Phase2;
