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
        <h2 className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl py-2">
          Polun jakaminen epäonnistui!
        </h2>
        <p className="text-sm smd:text-md md:text-lg lg:text-xl pb-2">
          Yritä jakamista uudestaan. Jos jakaminen ei vieläkään onnistu, ongelma
          voi johtua laitteiden käyttämistä verkoista. Siirtykää käyttämään
          molemmilla laitteilla esimerkiksi samaa WIFI tai mobiilidata verkkoa.
          Kun molemmat laitteet ovat yhdistettynä samaan verkkoon, pitäisi polun
          jakamisen onnistua varmasti.
        </p>
        <button
          className="btn-sp-primary bg-sp-red"
          onClick={closeSharingFailedModal}
        >
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
