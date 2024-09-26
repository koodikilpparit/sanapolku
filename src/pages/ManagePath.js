import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WordEntry = () => {
  const { pathName } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([{ word: 'Koira', icon: '🐕' }]);

  return (
    <div>
      <button onClick={() => navigate(-1)}>Takaisin</button>

      <h2>{pathName}</h2>
      <h3>Lisää sanoja</h3>


      {/* List of words */}
      <div>
        {words.map((wordEntry, index) => (
          <div key={index}>
            <span>{wordEntry.word}</span>
            <span>{wordEntry.icon}</span>
          </div>
        ))}
      </div>

      {/* Button to add a new word */}
      <button onClick={() => navigate(`/uusisana/${pathName}`)}>Lisää uusi sana</button>
    </div>
  );
};

export default WordEntry;