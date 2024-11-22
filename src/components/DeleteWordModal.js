import React from 'react';
import { deleteWord } from '../db/db';

import PropTypes from 'prop-types';

const DeleteWordModal = ({ onClose, wordId, setWords }) => {
  const handleWordDelete = async () => {
    try {
      await deleteWord(wordId);
      setWords((prevWords) => prevWords.filter((w) => w.id !== wordId));
    } catch (error) {
      console.error('Error deleting word:', error);
      alert('Error deleting the word.');
    }
    onClose();
  };

  const closeDeleteModal = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Vahvista poisto</h2>
        <p>Haluatko varmasti poistaa sanan?</p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={closeDeleteModal}>
            Peruuta
          </button>
          <button className="save-button" onClick={handleWordDelete}>
            Poista
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteWordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  wordId: PropTypes.number.isRequired,
  setWords: PropTypes.func.isRequired,
};

export default DeleteWordModal;
