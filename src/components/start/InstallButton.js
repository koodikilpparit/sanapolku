import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function InstallButton({ onClick }) {
  return (
    <button className="settings-button" onClick={onClick}>
      <FontAwesomeIcon
        icon={faCircleDown}
        color="white"
        className="settings-icon"
      />
    </button>
  );
}

InstallButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default InstallButton;
