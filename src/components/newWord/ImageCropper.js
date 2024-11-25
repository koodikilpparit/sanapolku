import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageCropper = ({
  imageSrc,
  onCroppedImage,
  onBack,
  imageSource,
  reopenFileSelector,
}) => {
  const cropperRef = useRef(null);

  const handleCrop = () => {
    if (!cropperRef.current) return;

    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      maxWidth: 600,
      maxHeight: 600,
    });

    onCroppedImage(croppedCanvas.toDataURL('image/png'));
  };

  const handleBack = () => {
    if (imageSource === 'device') {
      reopenFileSelector();
    }
    onBack();
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      {imageSrc && (
        <div className="relative w-full h-full flex justify-center items-center bg-white p-6 rounded-lg shadow-lg">
          <h3 className="absolute top-4 sm:top-2 w-full text-center z-20 text-xl font-semibold text-black">
            Rajaa kuva
          </h3>
          <div className="relative w-11/12 h-full max-h-[80%] flex justify-center items-center cropper-container">
            <Cropper
              src={imageSrc}
              style={{ height: '100%', width: '100%' }}
              aspectRatio={1}
              guides={false}
              zoomable={true}
              movable={true}
              cropBoxResizable={false}
              cropBoxMovable={true}
              dragMode="none"
              viewMode={0}
              ref={cropperRef}
            />
          </div>
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 bg-gray-300 text-black py-1 px-3 rounded hover:bg-gray-400 transition"
          >
            Takaisin
          </button>
          <button
            onClick={handleCrop}
            className="absolute bottom-2 sm:bottom-1 left-1/2 transform -translate-x-1/2 bg-sp-dark-green text-white py-2 px-4 sm:py-0.5 rounded"
          >
            Rajaa
          </button>
        </div>
      )}
    </div>
  );
};

ImageCropper.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  onCroppedImage: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  imageSource: PropTypes.string,
  reopenFileSelector: PropTypes.func,
};

export default ImageCropper;
