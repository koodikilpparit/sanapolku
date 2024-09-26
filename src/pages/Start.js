import React from "react";
import { useNavigate } from "react-router-dom";

function Start() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Sanapolku</h2>
            <button onClick={() => navigate('/asetukset')}>Asetukset</button>
            <button onClick={() => navigate('/polut')}>Aloita</button>
            <button onClick={() => navigate('/ohjeet')}>Miten pelaan?</button>
        </div>
    );
}

export default Start;