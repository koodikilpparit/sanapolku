import React from 'react';
import PropTypes from 'prop-types';
import Phase1 from './Phase1';
import Phase2 from './Phase2';
import Phase3 from './Phase3';
const PhaseController = ({
  currentPhase,
  currentWord,
  playerInput,
  handleInputChange,
  handleSubmit,
  setPlayerInput,
  inputRefs,
  shuffledWord = '',
  incorrectIndices,
  inputDisabled,
  showContinueButton,
  handleContinueOnWrongAnswer,
  showSkipButton,
  handleSkip,
}) => {
  switch (currentPhase) {
    case 1:
      return (
        <Phase1
          currentWord={currentWord}
          playerInput={playerInput}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          showSkipButton={showSkipButton}
          handleSkip={handleSkip}
          inputRefs={inputRefs}
          incorrectIndices={incorrectIndices}
          inputDisabled={inputDisabled}
          showContinueButton={showContinueButton}
          handleContinueOnWrongAnswer={handleContinueOnWrongAnswer}
        />
      );
    case 2:
      return (
        <Phase2
          currentWord={currentWord}
          shuffledWord={shuffledWord}
          playerInput={playerInput}
          handleSubmit={handleSubmit}
          setPlayerInput={setPlayerInput}
          incorrectIndices={incorrectIndices}
          inputDisabled={inputDisabled}
          showContinueButton={showContinueButton}
          handleContinueOnWrongAnswer={handleContinueOnWrongAnswer}
          showSkipButton={showSkipButton}
          handleSkip={handleSkip}
        />
      );
    case 3:
      return (
        <Phase3
          currentWord={currentWord}
          playerInput={playerInput}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          inputRefs={inputRefs}
          incorrectIndices={incorrectIndices}
          inputDisabled={inputDisabled}
          showContinueButton={showContinueButton}
          handleContinueOnWrongAnswer={handleContinueOnWrongAnswer}
          showSkipButton={showSkipButton}
          handleSkip={handleSkip}
        />
      );
    default:
      return null;
  }
};

PhaseController.propTypes = {
  currentPhase: PropTypes.number.isRequired,
  currentWord: PropTypes.shape({
    imageData: PropTypes.object.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  playerInput: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setPlayerInput: PropTypes.func.isRequired,
  inputRefs: PropTypes.object.isRequired,
  shuffledWord: PropTypes.string,
  incorrectIndices: PropTypes.array,
  inputDisabled: PropTypes.bool,
  showContinueButton: PropTypes.bool,
  handleContinueOnWrongAnswer: PropTypes.func,
  showSkipButton: PropTypes.bool.isRequired,
  handleSkip: PropTypes.func.isRequired,
};

export default PhaseController;
