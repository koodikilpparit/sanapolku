import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PapunetPhotoFetcher from '../util/PapunetPhotoFetcher';
import './PapunetView.css';

const PapunetView = ({ onSelectImage, initialSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (initialSearchTerm) {
      handleFetchPhotos();
    }
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleFetchPhotos = async () => {
    try {
      const fetchedPhotos = await PapunetPhotoFetcher.fetchPhotos(searchTerm);
      setPhotos(fetchedPhotos);
      setError(null);
    } catch (err) {
      setError('Error fetching photos');
      setPhotos([]);
    }
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
