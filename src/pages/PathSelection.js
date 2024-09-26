import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PathSelection = () => {
  const navigate = useNavigate();

  // State for paths
  const [paths, setPaths] = useState(['Juha', 'Eläimet', 'Peli']);
  const [newPath, setNewPath] = useState('');

  // Function to handle adding a new path
  const handleAddPath = () => {
    if (newPath.trim()) {
      // Check if a path with the same name already exists
      const pathExists = paths.some((path) => path.toLowerCase() === newPath.toLowerCase());
  
      if (!pathExists) {
        setPaths([...paths, newPath]);
        setNewPath('');
        console.log('Path added:', newPath);
      } else {
        console.log('Path with this name already exists');
        alert('Path with this name already exists');
      }
    }
  };

    // Function to handle clicking a path
  const handlePathClick = (path) => {
    navigate(`/muokaapolkua/${path}`); // Navigate to the word entry page with the path as a parameter
  };

  return (
    <div>
      {/* Back button */}
      <button onClick={() => navigate(-1)}>Takaisin</button>

      {/* Input field to add a new path */}
      <div>
        <input
          type="text"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="Syötä uusi polku"
        />
        <button onClick={handleAddPath}>Lisää polku</button>
      </div>

      {/* List of paths */}
      <div>
        {paths.map((path, index) => (
          <button key={index} onClick={() => handlePathClick(path)}>
            <span>{path}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PathSelection;