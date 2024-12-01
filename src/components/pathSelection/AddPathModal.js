import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';

const AddPathModal = ({ onClose, onOpenReceive }) => {
  const navigate = useNavigate();
  const [newPath, setNewPath] = useState('');

  // Function to add a new path to the database and navigate
  // to path management page
  const handleAddPath = () => {
    if (newPath.trim()) {
      const pathId = crypto.randomUUID();
      setNewPath('');
      onClose();
      navigate(`/uusisana/${pathId}`, { state: { newPathName: newPath } });
    } else {
      alert('Anna polulle nimi');
    }
  };

  // Function to close the modal for creating a new path
  const closeNewPathModal = () => {
    setNewPath('');
    onClose();
  };

  // Function to open the modal for sharing a path
  const openReceivePathModal = () => {
    onOpenReceive();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Vastaanota polku</h2>
        <button className="receive-path-button" onClick={openReceivePathModal}>
          Siirry vastaanottamaan polku
        </button>
        <h2>Lisää uusi polku</h2>
        <input
          type="text"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="Anna polun nimi"
          className="modal-input"
        />
        <div className="modal-buttons">
          <button className="cancel-button" onClick={closeNewPathModal}>
            Peruuta
          </button>
          <button className="save-button" onClick={handleAddPath}>
            Tallenna
          </button>
        </div>
      </div>
    </div>
  );
};

AddPathModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenReceive: PropTypes.func.isRequired,
};

export default AddPathModal;
