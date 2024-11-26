import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './AddButton.css';

const AddButton = ({ onClick }) => {
  return (
    <button className="add-button" onClick={onClick}>
      <FontAwesomeIcon
        icon={faPlus}
        className="add-word-icon"
        data-testid="add-word-icon"
      />
    </button>
  );
};

AddButton.propTypes = {
  onClick: PropTypes.func,
};

export default AddButton;
