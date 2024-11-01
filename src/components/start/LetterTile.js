// src/components/start/LetterTile.js
import React from 'react';
import PropTypes from 'prop-types';

function LetterTile({ letter }) {
  return (
    <div className="letter-tile" data-testid="letter-tile">
      {letter}
    </div>
  );
}

LetterTile.propTypes = {
  letter: PropTypes.string.isRequired,
};

export default LetterTile;
