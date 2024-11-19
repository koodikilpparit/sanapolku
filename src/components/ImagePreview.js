import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import './ImagePreview.css';

const ImagePreview = ({ image, author }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Magnifying Glass Button */}
      <button
        className="magnify-btn"
        onClick={handleOpenModal}
        aria-label="Preview Image"
      >
        🔍
      </button>

      {/* Modal for Image Preview */}
      <Modal isOpen={isModalOpen} modalType="image-preview">
        <div className="image-preview-container">
          <button
            className="close-btn"
            onClick={handleCloseModal}
            aria-label="Close Preview"
          >
            ✖
          </button>
          <img src={image} alt="Preview" className="enlarged-image" />
          {author && <p className="image-author">Tekijä: {author}</p>}
        </div>
      </Modal>
    </>
  );
};

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
  author: PropTypes.string,
};

export default ImagePreview;
