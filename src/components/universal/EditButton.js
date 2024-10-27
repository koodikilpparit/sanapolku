import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './EditButton.css';

const EditButton = ({ path }) => {
  const navigate = useNavigate();

  return (
    <button
      className="edit-button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/muokkaapolkua/${path}`);
      }}
    >
      <FontAwesomeIcon icon={faEdit} className="edit-icon" />
    </button>
  );
};

EditButton.propTypes = {
  path: PropTypes.string.isRequired, // path is required
};

export default EditButton;
