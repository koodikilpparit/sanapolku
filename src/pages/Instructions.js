import React from 'react';
import BackButton from "../components/instructions/BackButton";
import InstructionsText from "../components/instructions/InstructionsText";
import "./Instructions.css"

function Instructions() {
  
  return (
    <div className="instructions-page">
      <div className="top-bar">
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
