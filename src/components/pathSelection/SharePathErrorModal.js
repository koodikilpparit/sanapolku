import React from 'react';

import PropTypes from 'prop-types';

const SharePathErrorModal = ({ onClose }) => {
  // Function to close the modal for instructions why path sharing failed
  const closeSharingFailedModal = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Polun jakaminen epäonnistui!</h2>
        <p>Yritä jakamista uudestaan.</p>
        <p>
          Jos virhe tulee vain vastaanottajalle, niin samanniminen polku on jo
          todennäköisesti olemassa. Varmista, ettei samannimistä polkua ole jo.
        </p>
        <p>
          Jos jakaminen ei vieläkään onnistu, ongelma voi johtua laitteiden
          käyttämistä verkoista. Siirtykää käyttämään molemmilla laitteilla
          esimerkiksi samaa WIFI tai mobiilidata verkkoa. Kun molemmat laitteet
          ovat yhdistettynä samaan verkkoon, pitäisi polun jakamisen onnistua.
        </p>
        <button className="save-button" onClick={closeSharingFailedModal}>
          Sulje
        </button>
      </div>
    </div>
  );
};

SharePathErrorModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default SharePathErrorModal;
