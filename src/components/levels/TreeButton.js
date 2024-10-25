// TreeButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree } from '@fortawesome/free-solid-svg-icons';

const TreeButton = ({ onClick }) => (
  <button className="tree-button" onClick={onClick}>
    <FontAwesomeIcon icon={faTree} className="tree-icon" />
  </button>
);

TreeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default TreeButton;