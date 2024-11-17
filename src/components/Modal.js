import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  children,
  modalType,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-modal-type={modalType || ''}>
      <div className="modal-content">
        {showCloseButton && (
          <button className="modal-close-button" onClick={onClose}>
            X
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  modalType: PropTypes.string,
  showCloseButton: PropTypes.bool,
};

export default Modal;
