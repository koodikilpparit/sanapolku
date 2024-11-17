// src/components/universal/Header.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import BackButton from './BackButton';
import EditButton from './EditButton';
import './Header.css';

const Header = ({ title, onCenterClick, onRightClick }) => {
  return (
    <div className="header">
      <div className="header-left">
        <BackButton />
      </div>
      <div className="header-center">
        <h2 className="header-title">{title} </h2>
        <EditButton onClick={onCenterClick} color="white"></EditButton>
      </div>
      <div className="header-right">
        <FontAwesomeIcon
          icon={faPlus}
          className="header-icon"
          onClick={onRightClick}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onCenterClick: PropTypes.func,
  onRightClick: PropTypes.func,
};

export default Header;
