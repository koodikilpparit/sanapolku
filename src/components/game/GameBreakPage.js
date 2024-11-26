import React from 'react';
import PropTypes from 'prop-types';
import './GameBreakPage.css';

const GameBreakPage = ({ onContinue }) => {
  return (
    <div className="break-content">
      <h2>Hienoa!</h2>
      <p className="break-page-paragraph-1">
        Saavuit levähdyspaikalle! Nyt on aika levätä hieman ennen kuin matka
        jatkuu.
      </p>
      <p className="break-page-paragraph-2">
        Pidä pieni tauko ennen kuin jatkat peliä.
      </p>
      <img
        className="break-img"
        src={`${process.env.PUBLIC_URL}/break-img.svg`}
        alt="Camp fire along a path"
      />
      <div className="break-buttons-container">
        <button
          className="continue-button"
          onClick={onContinue}
          aria-label="Continue game"
        >
          JATKA
        </button>
      </div>
    </div>
  );
};

GameBreakPage.propTypes = {
  onContinue: PropTypes.func.isRequired,
};

export default GameBreakPage;
