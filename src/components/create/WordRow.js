import React from 'react';
import PropTypes from 'prop-types';
import DeleteButton from '../universal/DeleteButton';
import EditButton from '../universal/EditButton';

const WordRow = ({ word, imgSrc, onDelete, onEdit }) => {
  return (
    <div className="word-row-container">
      <span className="word-text">{word}</span>
      <img
        src={imgSrc || '/mrBean.png'}
        alt={word}
        className="word-image"
        style={{ marginRight: '10px' }}
      />
      <EditButton onClick={onEdit} />
      <DeleteButton onClick={onDelete} />
    </div>
  );
};

WordRow.propTypes = {
  word: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default WordRow;
