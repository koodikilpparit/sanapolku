import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPolut, addPolku } from '../db/db';
import '../styles/PathSelection.css';
import BackButton from '../components/universal/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const PathSelection = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState('');

  // Hakee kaikki polut tietokannasta kun komponentti latautuu
  useEffect(() => {
    getAllPolut()
      .then((polut) => setPaths(Array.isArray(polut) ? polut.map((polku) => polku.name) : []))
      .catch(() => console.error("Virhe polkujen haussa"));
  }, []);


  // Funktio joka lisää uuden polun tietokantaan
  const handleAddPath = () => {
    if (newPath.trim()) {
      addPolku(newPath)
        .then(() => {
          setPaths([...paths, newPath]);
          setNewPath('');
          console.log('Polku lisätty:', newPath);
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message);
        });
    } else {
      alert('Syötä polun nimi');
    }
  };

  // Funktio joka navigoi polun hallintasivulle
  const handlePathClick = (path) => {
    navigate(`/muokaapolkua/${path}`);
  };

  return (
    <div className="paths-page">

      {/* Header */}
      <div className="header">
        <BackButton />
        <h2 className="title">Omat polut</h2>
        <FontAwesomeIcon icon={faPlus} className="add-path-icon"/>
      </div>

      {/* Input uuden polun lisäämistä varten */}
      <div className="input-section">
        <input
          type="text"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="Syötä uusi polku"
          className="path-input"
        />
        <button className="add-path-button" onClick={handleAddPath}>Lisää polku</button>
      </div>

      {/* Lista poluista */}
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