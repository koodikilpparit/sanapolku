import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchPhotos } from '../utils/PapunetPhotoFetcher';
import '../styles/PapunetView.css';

const PapunetView = ({ onSelectImage, initialSearchTerm, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const initialFetchDone = useRef(false);

  const getPhotos = useCallback(async (term) => {
    try {
      const fetchedPhotos = await fetchPhotos(term);
      setPhotos(fetchedPhotos);
      setError(null);
    } catch (err) {
      setError('Error fetching photos');
      setPhotos([]);
    }
  }, []);

  // Fetch photos on initial render if initial search term is provided
  useEffect(() => {
    if (initialSearchTerm && !initialFetchDone.current) {
      getPhotos(initialSearchTerm);
      initialFetchDone.current = true;
    }
  }, [getPhotos, initialSearchTerm]);

  const handleFetchPhotos = () => {
    getPhotos(searchTerm);
  };

  const handleSave = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
    }
  };

  return (
    <div className="photo-fetcher">
      <h1>Photo Fetcher</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter search term"
      />
      <button onClick={handleFetchPhotos}>Fetch Photos</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="photo-container">
        {photos.map((photo) => (
          <div
            key={photo.uid}
            className={`photo ${selectedImage?.src === photo.url ? 'selected' : ''}`}
            onClick={() =>
              setSelectedImage({ src: photo.url, author: photo.author })
            }
          >
            <img src={photo.thumb} alt={photo.name} />
            <p>{photo.name}</p>
            <p>Tekijä: {photo.author}</p>
          </div>
        ))}
      </div>

      <div className="return-save-button-container">
        <button className="btn-sp-primary return-btn" onClick={closeModal}>
          PERUUTA
        </button>
        <button className="btn-sp-primary save-btn" onClick={handleSave}>
          TALLENNA
        </button>
      </div>
    </div>
  );
};

PapunetView.propTypes = {
  onSelectImage: PropTypes.func.isRequired,
  initialSearchTerm: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
};

export default PapunetView;
