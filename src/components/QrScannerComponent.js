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
    const startScanning = async () => {
      try {
        await qrScannerRef.current.start();
      } catch {
        console.warn(
          'Scanner found a camera but could not start scanning. Is camera allowed?'
        );
        setIsCameraAvailable(false);
      }
    };
    if (scannerReady) {
      startScanning();
    }
  }, [scannerReady]);

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full sm:w-2/3">
      {isCameraAvailable ? (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          data-testid="video-element"
          width="100%"
          height="100%"
        />
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
