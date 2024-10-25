import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './DeleteButton.css';

const DeleteButton = ({ onClick }) => {
  return (
    <button className="delete-button" onClick={onClick}>
      <FontAwesomeIcon icon={faTrash} className="delete-icon" />
    </button>
  );
};

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired, // onClick is required
};

export default DeleteButton;
