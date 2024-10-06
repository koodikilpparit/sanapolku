// src/components/start/StartButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

function StartButton() {
    const navigate = useNavigate();

    return (
        <button className="start-button" onClick={() => navigate('/polut')}>
            <FontAwesomeIcon icon={faGamepad} className="start-icon" />
            Aloita
        </button>
    );
}

export default StartButton;