import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPolut, addPolku } from '../db/db';

const PathSelection = () => {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [newPath, setNewPath] = useState('');

  useEffect(() => {
    getAllPolut()
      .then((polut) => setPaths(Array.isArray(polut) ? polut.map((polku) => polku.name) : []))
      .catch(() => console.error("Virhe polkujen haussa"));
  }, []);

  const handleAddPath = () => {
    if (newPath.trim()) {
      addPolku(newPath)
        .then(() => {
          setPaths([...paths, newPath]); // Päivitetään polkulista
          setNewPath(''); // Tyhjennetään tekstikenttä
          console.log('Polku lisätty:', newPath);
        })
        .catch((error) => {
          console.error(error.message);
          alert(error.message); // Näytetään virheilmoitus, jos polku on jo olemassa
        });
    } else {
      alert('Syötä polun nimi');
    }
  };

  const handlePathClick = (path) => {
    navigate(`/muokaapolkua/${path}`); // Navigointi muokkausnäkymään valitun polun kanssa
  };

  return (
    <div>
      {/* Takaisin-nappi */}
      <button onClick={() => navigate(-1)}>Takaisin</button>

      {/* Syötekenttä uuden polun lisäämiseksi */}
      <div>
        <input
          type="text"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="Syötä uusi polku"
        />
        <button onClick={handleAddPath}>Lisää polku</button>
      </div>

      {/* Polkulista */}
      <div>
        {paths.length > 0 ? (
          paths.map((path, index) => (
            <button key={index} onClick={() => handlePathClick(path)}>
              <span>{path}</span>
            </button>
          ))
        ) : (
          <p>Ei polkuja löytynyt</p>
        )}
      </div>
    </div>
  );
};

export default PathSelection;