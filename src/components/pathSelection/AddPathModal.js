import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from './PathContext';
import { addPath } from '../../db/db';

import PropTypes from 'prop-types';

const AddPathModal = ({ onClose, onOpenReceive }) => {
  const navigate = useNavigate();
  const [newPath, setNewPath] = useState('');

  const { setPaths } = useContext(PathContext);

  // Function to add a new path to the database and navigate
  // to path management page
  const handleAddPath = () => {
    if (newPath.trim()) {
      addPath(newPath)
        .then((pathId) => {
          setPaths((prevPaths) => [
            ...prevPaths,
            { id: pathId, name: newPath },
          ]);
          setNewPath('');
          console.log('Path added:', newPath);
          onClose();
          navigate(`/muokkaapolkua/${pathId}`);
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message);
        });
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
