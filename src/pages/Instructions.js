import React from 'react';
import BackButton from "../components/instructions/BackButton";
import InstructionsText from "../components/instructions/InstructionsText";
import "./Instructions.css";

function Instructions() {
  
  return (
    <div className="instructions-page">
      <div className="ins-top-bar">
        <BackButton className="ins-back-button"/>
      </div>
      <div className="ins-center-area">
        <div className="ins-header">
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
