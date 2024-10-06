import React from 'react';
import BackButton from "../components/instructions/BackButton";
import InstructionsText from "../components/instructions/InstructionsText";

function Instructions() {
  
  return (
    <div>
      <div className="back-button">
        <BackButton/>
      </div>
      <div className="center-area">
        <div className="header">
          <h2>Pelin ohjeet</h2>
        </div>
          <div className="instructions-text">
            <InstructionsText/>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
