// TreeButton.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree } from '@fortawesome/free-solid-svg-icons';

const TreeButton = ({ onClick, style }) => (
  <button className="tree-button" onClick={onClick} style={style}>
    <FontAwesomeIcon icon={faTree} className="tree-icon" />
  </button>
);

TreeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
};

export default TreeButton;
