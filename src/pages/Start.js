import React from "react";
import SettingsButton from "../components/start/SettingsButton";
import StartButton from "../components/start/StartButton";
import HelpButton from "../components/start/HelpButton";
import LetterTile from "../components/start/LetterTile";

function Start() {

    return (
        <div className="start-page">
            <div className="top-bar">
            <SettingsButton/>
            </div>
            <div className="center-area">
                <div className="logo">
                    <div className="logo-upper">
                        <LetterTile letter={'S'}/>
                        <LetterTile letter={'A'}/>
                        <LetterTile letter={'N'}/>
                        <LetterTile letter={'A'}/>
                    </div>
                    <div className="logo-lower">
                        <LetterTile letter={'P'}/>
                        <LetterTile letter={'O'}/>
                        <LetterTile letter={'L'}/>
                        <LetterTile letter={'K'}/>
                        <LetterTile letter={'U'}/>
                    </div>
                </div>
                <div className="start-button">
                    <StartButton/>
                </div>
                <div className="help-button">
                    <HelpButton/>
                </div>
            </div>
        </div>
    );
}

export default Start;