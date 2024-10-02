import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPaths, addPath } from '../db/db';
import '../styles/PathSelection.css';
import BackButton from '../components/universal/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const PathSelection = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState('');

  // Fetch all paths from the database when the component loads
  useEffect(() => {
    getAllPaths()
      .then((paths) => setPaths(Array.isArray(paths) ? paths.map((path) => path.name) : []))
      .catch(() => console.error("Error fetching paths"));
  }, []);

  // Function to add a new path to the database
  const handleAddPath = () => {
    if (newPath.trim()) {
      addPath(newPath)
        .then(() => {
          setPaths([...paths, newPath]);
          setNewPath('');
          console.log('Path added:', newPath);
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message);
        });
    } else {
      alert('Please enter a path name');
    }
  };

  // Function to navigate to the path management page
  const handlePathClick = (path) => {
    navigate(`/muokaapolkua/${path}`);
  };

  return (
    <div className="paths-page">

      {/* Header */}
      <div className="header">
        <BackButton />
        <h2 className="title">Polut</h2>
        <FontAwesomeIcon icon={faPlus} className="add-path-icon" />
      </div>

      {/* Input for adding a new path */}
      <div className="input-section">
        <input
          type="text"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="Anna polun nimi"
          className="path-input"
        />
        <button className="add-path-button" onClick={handleAddPath}>Lisää polku</button>
      </div>

      {/* List of paths */}
      <div className="path-list">
        {paths.length > 0 ? (
          paths.map((path, index) => (
            <button key={index} className="path-item" onClick={() => handlePathClick(path)}>
              <span>{path}</span>
            </button>
          ))
        ) : (
          <p className="no-paths">Ei polkuja.</p>
        )}
      </div>
    </div>
  );
};

export default PathSelection;