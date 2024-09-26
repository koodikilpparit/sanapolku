import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WordEntry = () => {
  const { pathName } = useParams();
  const navigate = useNavigate();
  
  // Initial words array with local images from the public folder
  const [words] = useState([
    { word: 'Koira', img: '/mrBean.png' }, // Image stored locally
  ]);

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
            <img
              src={wordEntry.img || '/mrBean.png'} // Use local placeholder image if no img
              alt={wordEntry.word}
              style={{ width: '50px', height: '50px' }}
            />
          </div>
        ))}
      </div>

      {/* Button to add a new word */}
      <button onClick={() => navigate(`/uusisana/${pathName}`)}>Lisää uusi sana</button>
    </div>
  );
};

export default WordEntry;