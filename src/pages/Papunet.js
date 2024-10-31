import React, { useState } from 'react';
import PapunetPhotoFetcher from '../util/PapunetPhotoFetcher';
import './Papunet.css';

const PhotoFetcher = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoFetcher;
