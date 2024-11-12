import React, { useContext } from 'react';
import { PathContext } from './PathContext';
import { deletePath, getPathByName } from '../../db/db';

const DeletePathModal = ({ onClose }) => {
  const { currentPath, setCurrentPath, setPaths } = useContext(PathContext);
  // Handle path deletion
  const handlePathDelete = async () => {
    if (!currentPath) return;

    try {
      const pathData = await getPathByName(currentPath); // Wait for getPathByName to resolve
      if (!pathData || !pathData.id) {
        console.error('Path not found:', currentPath);
        alert('Path not found.');
        return;
      }

      await deletePath(pathData.id);
      setPaths((prevPaths) => prevPaths.filter((p) => p !== currentPath));
      console.log(`Deleted path with name: ${currentPath}`);
    } catch (error) {
      console.error('Error deleting path:', error);
      alert('Error deleting the path.');
    }
    onClose();
  };

  // Function to close the modal for deleting a path
  const closeDeleteModal = () => {
    setCurrentPath(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Vahvista poisto</h2>
        <p>
          Haluatko varmasti poistaa polun <b>{currentPath}</b>?
        </p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={closeDeleteModal}>
            Peruuta
          </button>
          <button className="save-button" onClick={handlePathDelete}>
            Poista
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePathModal;