import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import PapunetPhotoFetcher from '../utils/PapunetPhotoFetcher';
import '../styles/PapunetView.css';

const PapunetView = ({ onSelectImage, initialSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const initialFetchDone = useRef(false);

  const fetchPhotos = useCallback(async (term) => {
    try {
      const fetchedPhotos = await PapunetPhotoFetcher.fetchPhotos(term);
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
      fetchPhotos(initialSearchTerm);
      initialFetchDone.current = true;
    }
  }, [fetchPhotos, initialSearchTerm]);

  const handleFetchPhotos = () => {
    fetchPhotos(searchTerm);
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
          <div key={photo.uid} className="photo">
            <img src={photo.thumb} alt={photo.name} />
            <p>{photo.name}</p>
            <p>Author: {photo.author}</p>
            <button onClick={() => setSelectedImage(photo.thumb)}>
              Select
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

PapunetView.propTypes = {
  onSelectImage: PropTypes.func.isRequired,
  initialSearchTerm: PropTypes.string,
};

export default PapunetView;
