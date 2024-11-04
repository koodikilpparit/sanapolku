import React from 'react';
import PropTypes from 'prop-types';
import DeleteButton from '../universal/DeleteButton';

const WordRow = ({ word, imgSrc, onDelete }) => {
  return (
    <div className="word-row-container">
      <span className="word-text">{word}</span>
      <img src={imgSrc || '/mrBean.png'} alt={word} className="word-image" />
      <DeleteButton onClick={onDelete} />
    </div>
  );
};

WordRow.propTypes = {
  word: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

export default WordRow;
