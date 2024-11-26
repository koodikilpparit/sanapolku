import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './EditButton.css';

const EditButton = ({ onClick, color }) => {
  return (
    <button className="edit-button" onClick={onClick}>
      <FontAwesomeIcon
        icon={faEdit}
        className="edit-icon"
        style={{ color: color }}
      />
    </button>
  );
};

EditButton.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string,
};

export default EditButton;
