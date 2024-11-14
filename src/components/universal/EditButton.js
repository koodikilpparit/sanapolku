import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './EditButton.css';

const EditButton = ({ onClick }) => {
  return (
    <button className="edit-button" onClick={onClick}>
      <FontAwesomeIcon icon={faEdit} className="edit-icon" />
    </button>
  );
};

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired, // path is required
};

export default EditButton;
