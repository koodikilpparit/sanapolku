// src/components/universal/Header.js
import React from 'react';
import PropTypes from 'prop-types';
import BackButton from './BackButton';
import EditButton from './EditButton';
import AddButton from './AddButton';
import './Header.css';

const Header = ({ title, onCenterClick, onRightClick, backButtonUrl }) => {
  return (
    <div className="header">
      <div className="header-left">
        <BackButton url={backButtonUrl} />
      </div>
      <div className="header-center">
        <h2 className="header-title">{title} </h2>
        <EditButton onClick={onCenterClick} color="white"></EditButton>
      </div>
      <div className="header-right">
        <AddButton onClick={onRightClick} />
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  onCenterClick: PropTypes.func,
  onRightClick: PropTypes.func,
  backButtonUrl: PropTypes.string,
};

export default Header;
