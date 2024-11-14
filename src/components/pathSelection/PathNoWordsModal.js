import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathContext } from './PathContext';

import PropTypes from 'prop-types';

const PathNoWordsModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { currentPath, setCurrentPath } = useContext(PathContext);
  // Navigate to path management page
  const handleEditPathClick = (pathId) => {
    navigate(`/muokkaapolkua/${pathId}`);
    onClose();
  };

  // Function to close the modal for informing lack of words in path
  const closeNoWordsInPathModal = () => {
    setCurrentPath(null);
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Polulla ei ole vielä sanoja</h2>
        <div className="modal-buttons">
          <button className="save-button" onClick={closeNoWordsInPathModal}>
            Palaa takaisin
          </button>
          <button
            className="save-button"
            onClick={() => handleEditPathClick(currentPath.id)}
          >
            Muokkaa polkua
          </button>
        </div>
      </div>
    </div>
  );
};

PathNoWordsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PathNoWordsModal;
