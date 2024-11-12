import React, { useRef } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageCropper = ({ imageSrc, onCroppedImage }) => {
  const cropperRef = useRef(null);

  const handleCrop = () => {
    if (!cropperRef.current) return;

    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      maxWidth: 400,
      maxHeight: 400,
    });

    onCroppedImage(croppedCanvas.toDataURL('image/jpeg'));
  };

  return (
    <div>
      {imageSrc && (
        <div>
          <Cropper
            src={imageSrc}
            style={{ height: 400, width: '100%' }}
            aspectRatio={1}
            guides={false}
            zoomable={true}
            movable={true}
            cropBoxResizable={false}
            cropBoxMovable={true}
            dragMode="none"
            viewMode={1}
            ref={cropperRef}
          />
          <button onClick={handleCrop}>Rajaa ja tallenna</button>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
