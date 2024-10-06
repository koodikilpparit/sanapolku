// src/components/instructions/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();

    return (
        <button className="back-button" onClick={() => navigate('/')}>
            Takaisin
        </button>
    );
}

export default BackButton;