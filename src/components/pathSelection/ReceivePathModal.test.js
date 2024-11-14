import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PathContext } from './PathContext';
import ReceivePathModal from './ReceivePathModal';
import { connectToPeerAndReceive } from '../../utils/ShareUtils'; // Mocked function
import React from 'react';
import { importPath } from '../../utils/PathUtils';

// Mock the sendDataOnConnection function
jest.mock('../../utils/ShareUtils', () => ({
  connectToPeerAndReceive: jest.fn(),
  QRCODE_PREFIX: 'sanapolku:',
}));

jest.mock('../../utils/PathUtils', () => ({
  importPath: jest.fn(),
}));

// Mock the QrScannerComponent
jest.mock('../QrScannerComponent', () => ({
  __esModule: true,
  default: ({ onSuccess }) => (
    <div
      data-testid="mock-qr-scanner"
      onClick={() => onSuccess({ data: 'sanapolku:testPeerId' })}
    ></div>
  ),
}));

describe('ReceivePathModal', () => {
  const onCloseMock = jest.fn();
  const contextValue = {
    peer: { id: 'testPeerId' },
    setPaths: jest.fn(),
    openSharingFailedModal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const initTest = () => {
    render(
      <PathContext.Provider value={contextValue}>
        <ReceivePathModal onClose={onCloseMock} />
      </PathContext.Provider>
    );
  };

  it('should render the ReceivePathModal and show instructions', () => {
    initTest();

    // Check if modal content renders
    expect(screen.getByText('Polun vastaanottaminen')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lue lähettäjän QR-koodi. Jos kamera ei ole käytettävissä, polun jakaminen onnistuu lähettäjän tunnisteen avulla.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Lähettäjän tunniste')
    ).toBeInTheDocument();
    expect(screen.getByText('Hae polku')).toBeInTheDocument();
  });

  it('should start receiving when targetPeerId is given to the input field', async () => {
    const mockImportedPath = { id: 'path1', name: 'Imported Path' };
    connectToPeerAndReceive.mockResolvedValueOnce(mockImportedPath);
    importPath.mockResolvedValueOnce(mockImportedPath);

    initTest();

    // Simulate writing to the input field
    fireEvent.change(screen.getByPlaceholderText('Lähettäjän tunniste'), {
      target: { value: 'testPeerId' },
    });
    fireEvent.click(screen.getByText('Hae polku'));

    // Wait for the successful path reception
    await waitFor(() => {
      expect(connectToPeerAndReceive).toHaveBeenCalledWith(
        contextValue.peer,
        'testPeerId',
        importPath
      );
      expect(screen.getByText('Polun jakaminen onnistui!')).toBeInTheDocument();
    });
  });

  it('should handle failed path reception and show error message', async () => {
    connectToPeerAndReceive.mockRejectedValueOnce(
      new Error('Connection failed')
    );
    importPath.mockRejectedValueOnce(new Error('Failed to import path'));

    initTest();

    // Simulate a receiving of path
    fireEvent.change(screen.getByPlaceholderText('Lähettäjän tunniste'), {
      target: { value: 'testPeerId' },
    });
    fireEvent.click(screen.getByText('Hae polku'));

    // Wait for the failure handling
    await waitFor(() => {
      expect(connectToPeerAndReceive).toHaveBeenCalled();
      expect(contextValue.openSharingFailedModal).toHaveBeenCalled();
      expect(
        screen.queryByText('Polun jakaminen onnistui!')
      ).not.toBeInTheDocument();
    });
  });

  it('should call onClose when the close button is clicked', () => {
    initTest();

    const closeButton = screen.getByText('Palaa takaisin');
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should handle empty peer ID input and not attempt to receive path', async () => {
    initTest();

    // Simulate an empty input and clicking the "Hae polku" button
    fireEvent.change(screen.getByPlaceholderText('Lähettäjän tunniste'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Hae polku'));

    // Ensure that no path reception occurs
    await waitFor(() => {
      expect(connectToPeerAndReceive).not.toHaveBeenCalled();
    });
  });

  it('should update state and start receiving when a valid QR code is scanned', async () => {
    const mockImportedPath = { id: 'path1', name: 'Imported Path' };
    connectToPeerAndReceive.mockResolvedValueOnce(mockImportedPath);
    importPath.mockResolvedValueOnce(mockImportedPath);

    initTest();

    // Simulate QR code scan with a valid code by clicking the mocked QR scanner
    fireEvent.click(screen.getByTestId('mock-qr-scanner'));

    // Check if state is updated and path reception starts
    await waitFor(() => {
      expect(connectToPeerAndReceive).toHaveBeenCalledWith(
        contextValue.peer,
        'testPeerId',
        importPath
      );

      expect(screen.getByText('Polun jakaminen onnistui!')).toBeInTheDocument();
    });
  });

  it('should not update state or start receiving if QR code scan is started after receive has already started', async () => {
    initTest();

    // Initially, QR scan should not trigger anything until the process starts
    const qrScanner = screen.getByTestId('mock-qr-scanner');
    fireEvent.click(qrScanner);

    // Ensure the receive process doesn't start again if already started
    expect(screen.getByText('Yhdistetään...')).toBeInTheDocument();

    fireEvent.click(qrScanner);

    // Ensure the scan doesn't restart the process
    expect(connectToPeerAndReceive).toHaveBeenCalledTimes(1);
  });
});
