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
  inputRefs,
  shuffledWord = '',
}) => {
  switch (currentPhase) {
    case 1:
      return (
        <Phase1
          currentWord={currentWord}
          playerInput={playerInput}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          inputRefs={inputRefs}
        />
      );
    case 2:
      return (
        <Phase2
          currentWord={currentWord}
          shuffledWord={shuffledWord}
          playerInput={playerInput}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          inputRefs={inputRefs}
        />
      );
    case 3:
      return (
        <Phase3
          currentWord={currentWord}
          playerInput={playerInput}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      );
    default:
      return null;
  }
};

PhaseController.propTypes = {
  currentPhase: PropTypes.number.isRequired,
  currentWord: PropTypes.shape({
    img: PropTypes.string.isRequired,
    word: PropTypes.string.isRequired,
  }).isRequired,
  playerInput: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  inputRefs: PropTypes.object.isRequired,
  shuffledWord: PropTypes.string,
};

export default PhaseController;
