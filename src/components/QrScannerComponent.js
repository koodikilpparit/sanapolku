import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import QrScanner from 'qr-scanner';

const QrScannerComponent = ({ onSuccess }) => {
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);
  const qrScannerRef = useRef(null);
  const videoRef = useRef(null);
  const [scannerReady, setScannerReady] = useState(false);

  useLayoutEffect(() => {
    if (videoRef.current && isCameraAvailable) {
      const qrScanner = new QrScanner(videoRef.current, onSuccess, {
        preferredCamera: 'environment',
        highlightScanRegion: true,
      });
      qrScannerRef.current = qrScanner;
      setScannerReady(true);
    }
  }, [isCameraAvailable, onSuccess]);

  useEffect(() => {
    const checkCameraAvailability = async () => {
      const hasCamera = await QrScanner.hasCamera();
      setIsCameraAvailable(hasCamera);
    };
    checkCameraAvailability();
  }, []);

  useEffect(() => {
    if (scannerReady) {
      qrScannerRef.current.start();
    }
  }, [scannerReady]);

  return (
    <div>
      {isCameraAvailable ? (
        <video ref={videoRef} playsInline autoPlay />
      ) : (
        <p>Kameraa ei ole saatavilla QR koodin skannaamiseen</p>
      )}
    </div>
  );
};

QrScannerComponent.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default QrScannerComponent;
