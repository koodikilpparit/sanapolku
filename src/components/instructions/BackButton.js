// src/components/instructions/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

function BackButton() {
    const navigate = useNavigate();

    return (
        <button className="back-button" onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faChevronLeft} className="back-icon"/>
        </button>
    );
}

export default BackButton;