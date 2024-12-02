import React from 'react';

import PropTypes from 'prop-types';

const DeleteWordModal = ({ onClose, onDelete }) => {
  const handleWordDelete = async () => {
    onDelete();
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
  onDelete: PropTypes.func.isRequired,
};

export default DeleteWordModal;
