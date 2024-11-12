import React from 'react';

const SharePathErrorModal = ({ onClose }) => {
  // Function to close the modal for instructions why path sharing failed
  const closeSharingFailedModal = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Polun jakaminen epäonnistui!</h2>
        <p>
          Yritä jakamista uudestaan. Jos jakaminen ei vieläkään onnistu, ongelma
          voi johtua laitteiden käyttämistä verkoista. Siirtykää käyttämään
          molemmilla laitteilla esimerkiksi samaa WIFI tai mobiilidata verkkoa.
          Kun molemmat laitteet ovat yhdistettynä samaan verkkoon, pitäisi polun
          jakamisen onnistua varmasti.
        </p>
        <button className="save-button" onClick={closeSharingFailedModal}>
          Sulje
        </button>
      </div>
    </div>
  );
};

export default SharePathErrorModal;
