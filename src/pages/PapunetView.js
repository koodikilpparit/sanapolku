import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { fetchPhotos, proxy } from '../utils/PapunetPhotoFetcher';
import PapunetFilterMenu from '../components/newWord/PapunetFilterMenu';
import '../styles/PapunetView.css';

const PapunetView = ({ onSelectImage, initialSearchTerm, closeModal }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const getPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPhotos = await fetchPhotos(searchTerm, selectedFilters);
      setPhotos(fetchedPhotos);
      setError(null);
    } catch (err) {
      setError('Virhe kuvien hakemisessa');
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFilters, searchTerm]);

  // Fetch photos on initial render if initial search term is provided
  useEffect(() => {
    if (initialSearchTerm && !initialFetchDone.current) {
      getPhotos();
      initialFetchDone.current = true;
    }
  }, [getPhotos, initialSearchTerm]);

  const handleFetchPhotos = () => {
    getPhotos();
    initialFetchDone.current = true;
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
      <button onClick={handleFetchPhotos} disabled={loading}>
        HAE KUVIA
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="photo-container">
        {loading ? (
          <p>Haetaan kuvia...</p>
        ) : photos.length === 0 && initialFetchDone.current ? (
          <p>Ei kuvatuloksia</p>
        ) : (
          photos.map((photo) => (
            <div
              key={photo.uid}
              className={`photo ${selectedImage?.src === proxy + photo.url ? 'selected' : ''}`}
              onClick={() =>
                setSelectedImage({
                  src: proxy + photo.url,
                  author: photo.author,
                })
              }
            >
              <img src={photo.thumb} alt={photo.name} />
              <p>{photo.name}</p>
              <p>Tekijä: {photo.author}</p>
            </div>
          ))
        )}
      </div>

      <div className="return-save-button-container">
        <button className="btn-sp-primary return-btn" onClick={closeModal}>
          PERUUTA
        </button>
        <button className="btn-sp-primary save-btn" onClick={handleSave}>
          VALITSE
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
