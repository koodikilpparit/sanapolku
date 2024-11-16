import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchPhotos } from '../utils/PapunetPhotoFetcher';
import PapunetFilterMenu from '../components/newWord/PapunetFilterMenu';
import '../styles/PapunetView.css';

const PapunetView = ({ onSelectImage, initialSearchTerm, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const initialFetchDone = useRef(false);

  const filters = {
    arasaac: 'Arasaac',
    kuvako: 'KUVAKO',
    mulberry: 'Mulberry',
    drawing: 'Piirroskuva',
    sclera: 'Sclera',
    toisto: 'Toisto',
    photo: 'Valokuva',
    sign: 'Viittomakuva',
  };

  const getPhotos = useCallback(
    async (term) => {
      try {
        const fetchedPhotos = await fetchPhotos(term, selectedFilters);
        setPhotos(fetchedPhotos);
        setError(null);
      } catch (err) {
        setError('Error fetching photos');
        setPhotos([]);
      }
    },
    [selectedFilters]
  );

  // Fetch photos on initial render if initial search term is provided
  useEffect(() => {
    if (initialSearchTerm && !initialFetchDone.current) {
      getPhotos(initialSearchTerm);
      initialFetchDone.current = true;
    }
  }, [getPhotos, initialSearchTerm]);

  useEffect(() => {
    if (initialFetchDone.current) {
      getPhotos(searchTerm);
    }
  }, [selectedFilters, getPhotos, searchTerm]);

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
      <h1>Papunet Kuvahaku</h1>

      <PapunetFilterMenu
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={setSelectedFilters}
      />

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter search term"
      />
      <button onClick={handleFetchPhotos}>HAE KUVIA</button>
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
