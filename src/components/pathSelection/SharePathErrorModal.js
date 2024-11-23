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
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl py-2">
          Polun jakaminen epäonnistui!
        </h2>
        <p className="text-md md:text-lg lg:text-xl">
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

SharePathErrorModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default SharePathErrorModal;
