import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import QrScanner from 'qr-scanner';
import QrScannerComponent from './QrScannerComponent';

jest.mock('qr-scanner');
QrScanner.mockImplementation(() => {
  return jest.fn().mockImplementation(() => {
    return {
      start: jest.fn().mockResolvedValue(),
      stop: jest.fn(),
      destroy: jest.fn(),
    };
  });
});

QrScanner.hasCamera = jest.fn();

describe('QrScannerComponent', () => {
  let onSuccessMock;

  beforeEach(() => {
    onSuccessMock = jest.fn();
    QrScanner.hasCamera.mockClear();
    QrScanner.mockClear();
  });

  test('renders fallback text when camera is not available', async () => {
    QrScanner.hasCamera.mockResolvedValue(false);

    await act(async () => {
      render(<QrScannerComponent onSuccess={onSuccessMock} />);
    });

    expect(
      screen.getByText('Kameraa ei ole saatavilla QR koodin skannaamiseen')
    ).toBeInTheDocument();
  });

  test('renders fallback text when scanner cannot start', async () => {
    QrScanner.hasCamera.mockResolvedValue(true);
    QrScanner.mockImplementationOnce(() => {
      return {
        start: jest.fn().mockRejectedValue(new Error('Cannot start scanner')),
        stop: jest.fn(),
        destroy: jest.fn(),
      };
    });

    await act(async () => {
      render(<QrScannerComponent onSuccess={onSuccessMock} />);
    });

    expect(
      screen.getByText('Kameraa ei ole saatavilla QR koodin skannaamiseen')
    ).toBeInTheDocument();
  });

  test('renders video element when camera is available', async () => {
    QrScanner.hasCamera.mockResolvedValue(true);

    await act(async () => {
      render(<QrScannerComponent onSuccess={onSuccessMock} />);
    });

    expect(screen.getByTestId('video-element')).toBeInTheDocument();
  });

  test('initializes and starts the QR scanner when camera is available', async () => {
    QrScanner.hasCamera.mockResolvedValue(true);

    await act(async () => {
      render(<QrScannerComponent onSuccess={onSuccessMock} />);
    });

    expect(QrScanner).toHaveBeenCalledTimes(1);
    expect(QrScanner.mock.instances[0].start).toHaveBeenCalledTimes(1);
  });

  test('cleans up the QR scanner on unmount', async () => {
    QrScanner.hasCamera.mockResolvedValue(true);

    let unmount;

    await act(async () => {
      const renderResult = render(
        <QrScannerComponent onSuccess={onSuccessMock} />
      );
      unmount = renderResult.unmount;
    });

    await act(async () => {
      unmount();
    });

    const instance = QrScanner.mock.instances[0];
    expect(instance.stop).toHaveBeenCalledTimes(1);
    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });
});
