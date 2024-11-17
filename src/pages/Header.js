// src/components/universal/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BackButton from './BackButton';
import '../styles/Header.css';

const Header = ({ title, rightIcon, onRightIconClick, showRightSection = true }) => {
  return (
    <div className="header">
      <div className="header-left">
        <BackButton onClick={onBackClick} />
      </div>
      <div className="header-center">
        <h2 className="header-title">{title}</h2>
      </div>
      {showRightSection && (
        <div className="header-right">
          {rightIcon && (
            <FontAwesomeIcon
              icon={rightIcon}
              className="header-icon"
              onClick={onRightIconClick}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Header;