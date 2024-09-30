// src/components/start/HelpButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

function HelpButton() {
    const navigate = useNavigate();

    return (
        <button className="help-button" onClick={() => navigate('/ohjeet')}>
            <FontAwesomeIcon icon={faCircleQuestion} className="help-icon" />
            Miten pelaan?
        </button>
    );
}

export default HelpButton;
