import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ url }) => {
  const navigate = useNavigate(); // Use React Router's navigation

  return (
    <button className="back-button" onClick={() => navigate(url)}>
      <FontAwesomeIcon icon={faChevronLeft} className="chevron-icon" />
    </button>
  );
};

BackButton.propTypes = {
  url: PropTypes.string.isRequired,
};

export default BackButton;
