import React from 'react';
import './Start.css'; // Lol liian laiska tekee ees mitää css tiedostoo napille

const handleShareClick = () => {
  console.log('Share');
};

const handleReceiveClick = () => {
  console.log('Receive');
};

const Share = () => {
  return (
    <div>
      <button className="start-button" onClick={handleShareClick}>
        Testaa jakamista
      </button>
      <button className="start-button" onClick={handleReceiveClick}>
        Testaa vastaanottamista
      </button>
    </div>
  );
};

export default Share;
