import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const WordRow = ({ word, imgSrc, onDelete }) => {
  return (
    <div className="word-row-container">
      <span className="word-text">{word}</span>
      <img src={imgSrc || '/mrBean.png'} alt={word} className="word-image" />
      <FontAwesomeIcon
        icon={faTrash}
        className="delete-icon"
        onClick={onDelete}
      />
    </div>
  );
};

export default WordRow;