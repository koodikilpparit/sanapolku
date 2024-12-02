import React, { createContext, useState } from 'react';

import PropTypes from 'prop-types';

export const PathContext = createContext();

export const PathProvider = ({ children }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);

  const [isSharingFailedModalOpen, setIsSharingFailedModalOpen] =
    useState(false);

  // Function to open the modal for instructions why path sharing failed
  const openSharingFailedModal = () => {
    setIsSharingFailedModalOpen(true);
  };

  return (
    <PathContext.Provider
      value={{
        paths,
        setPaths,
        currentPath,
        setCurrentPath,
        isSharingFailedModalOpen,
        setIsSharingFailedModalOpen,
        openSharingFailedModal,
      }}
    >
      {children}
    </PathContext.Provider>
  );
};

PathProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
