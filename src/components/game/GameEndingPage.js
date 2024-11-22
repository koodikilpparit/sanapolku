import React from 'react';

const GameEndingPage = () => {
  return (
    <div className="game-ending-page">
      <div className="ending-content">
      <h2>Peli ohi!</h2>
      <p>Saavuit levähdyspaikalle. Nyt on aika levätä hieman ennen kuin matka jatkuu.</p>
      <p>Pidä pieni tauko ennen kuin jatkat peliä.</p>
      <img className='ending-img'>
      </img>
      <div className="ending-buttons-container">
        <button className="home-button">
        </button>
        <button className="ready-button">
        </button>
        <button className="restart-button">
        </button>
      </div>
      </div>
    </div>
  );
};

export default GameEndingPage;
