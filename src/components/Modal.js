import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ isOpen, children, modalType }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-modal-type={modalType || ''}>
      <div className="modal-content">{children}</div>
    </div>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  modalType: PropTypes.string,
};

export default Modal;
