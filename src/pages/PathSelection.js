import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPaths, addPath } from '../db/db';
import '../styles/PathSelection.css';
import BackButton from '../components/universal/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import EditButton from '../components/universal/EditButton';

const PathSelection = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          setIsModalOpen(false);
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
    //navigate(`/muokaapolkua/${path}`);
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
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
          onClick={openModal}
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
            </div>
          ))
        ) : (
          <p className="no-paths">Ei polkuja.</p>
        )}
      </div>

      {/* Modal for adding a new path */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Lisää Uusi Polku</h2>
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="Anna polun nimi"
              className="modal-input"
            />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={closeModal}>
                Peruuta
              </button>
              <button className="save-button" onClick={handleAddPath}>
                Tallenna
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathSelection;
