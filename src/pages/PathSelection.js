import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPaths, addPath, deletePath, getPathByName } from '../db/db';
import '../styles/PathSelection.css';
import BackButton from '../components/universal/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import EditButton from '../components/universal/EditButton';
import DeleteButton from '../components/universal/DeleteButton';

const PathSelection = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState('');
  const [isNewPathModalOpen, setIsNewPathModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pathToDelete, setPathToDelete] = useState(null);

  // Fetch all paths from the database when the component loads
  useEffect(() => {
    getAllPaths()
      .then((paths) =>
        setPaths(Array.isArray(paths) ? paths.map((path) => path.name) : [])
      )
      .catch(() => console.error('Error fetching paths'));
  }, []);

  // Function to add a new path to the database
  const handleAddPath = () => {
    if (newPath.trim()) {
      addPath(newPath)
        .then(() => {
          setPaths([...paths, newPath]);
          setNewPath('');
          console.log('Path added:', newPath);
          setIsNewPathModalOpen(false);
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message);
        });
    } else {
      alert('Anna polulle nimi');
    }
  };

  // Function to navigate to the path management page
  const handlePathClick = (path) => {
    navigate(`/peli/${path}`);
    //navigate(`/muokkaapolkua/${path}`);
  };

  // Handle path deletion
  const handlePathDelete = async () => {
    if (!pathToDelete) return;

    try {
      const pathData = await getPathByName(pathToDelete); // Wait for getPathByName to resolve
      if (!pathData || !pathData.id) {
        console.error('Path not found:', pathToDelete);
        alert('Path not found.');
        return;
      }

      await deletePath(pathData.id);
      setPaths((prevPaths) => prevPaths.filter((p) => p !== pathToDelete));
      console.log(`Deleted path with name: ${pathToDelete}`);
    } catch (error) {
      console.error('Error deleting path:', error);
      alert('Error deleting the path.');
    }
    setIsDeleteModalOpen(false);
  };

  // Function to open the modal for deleting a path
  const openDeleteModal = (path) => {
    setPathToDelete(path);
    setIsDeleteModalOpen(true);
  };

  // Function to close the modal for deleting a path
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPathToDelete(null);
  };

  // Function to open the modal for creating a new path
  const openNewPathModal = () => {
    setIsNewPathModalOpen(true);
  };

  // Function to close the modal for creating a new path
  const closeNewPathModal = () => {
    setIsNewPathModalOpen(false);
    setNewPath('');
  };

  return (
    <div className="paths-page">
      {/* Header */}
      <div className="path-selection-header">
        <BackButton />
        <h2 className="title">Polut</h2>
        <FontAwesomeIcon
          icon={faPlus}
          className="add-path-icon"
          onClick={openNewPathModal}
          aria-label="Lisää uusi polku"
        />
      </div>

      {/* List of paths */}
      <div className="path-list">
        {paths.length > 0 ? (
          paths.map((path, index) => (
            <div key={index} className="path-item-container">
              <span className="path-item" onClick={() => handlePathClick(path)}>
                {path}
              </span>
              <EditButton path={path} />
              <DeleteButton onClick={() => openDeleteModal(path)} />
            </div>
          ))
        ) : (
          <p className="no-paths">Ei polkuja.</p>
        )}
      </div>

      {/* Modal for adding a new path */}
      {isNewPathModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
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
      )}

      {/* Modal for confirming deletion */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Vahvista poisto</h2>
            <p>
              Haluatko varmasti poistaa polun <b>{pathToDelete}</b>?
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
      )}
    </div>
  );
};

export default PathSelection;
