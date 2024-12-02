import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PathContext } from './PathContext';
import SharePathModal from './SharePathModal';
import { sendDataOnConnection } from '../../utils/ShareUtils'; // Mocked function
import React from 'react';
import { exportPath } from '../../utils/PathUtils';
import { SettingsContext } from '../../contexts/SettingsContext';

// Mock the sendDataOnConnection function
jest.mock('../../utils/ShareUtils', () => ({
  sendDataOnConnection: jest.fn(),
  QRCODE_PREFIX: 'testPrefix',
}));

// Mock the QRCode component to avoid issues during testing
jest.mock('react-qrcode-logo', () => ({
  QRCode: () => <div>Mocked QR Code</div>,
}));

jest.mock('../../utils/PathUtils', () => ({
  exportPath: jest.fn(),
}));

describe('SharePathModal', () => {
  const onCloseMock = jest.fn();
  const pathContextValue = {
    currentPath: { id: 'testPathId', name: 'Test Path' },
    openSharingFailedModal: jest.fn(),
  };

  const settingsContextValue = {
    peer: { id: 'testPeerId' },
    peerId: 'testPeerId',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const initSuccesfulShare = () => {
    const mockPath = { name: 'Test Path' };
    const mockWords = [{ word: 'word1' }, { word: 'word2' }];
    sendDataOnConnection.mockResolvedValueOnce();
    exportPath.mockResolvedValueOnce({ name: mockPath.name, words: mockWords });
    return render(
      <SettingsContext.Provider value={settingsContextValue}>
        <PathContext.Provider value={pathContextValue}>
          <SharePathModal onClose={onCloseMock} />
        </PathContext.Provider>
      </SettingsContext.Provider>
    );
  };

  const initFailureShare = () => {
    const mockPath = { name: 'Test Path' };
    const mockWords = [{ word: 'word1' }, { word: 'word2' }];
    sendDataOnConnection.mockRejectedValueOnce(new Error('Connection failed'));
    exportPath.mockResolvedValueOnce({ name: mockPath.name, words: mockWords });
    return render(
      <SettingsContext.Provider value={settingsContextValue}>
        <PathContext.Provider value={pathContextValue}>
          <SharePathModal onClose={onCloseMock} />
        </PathContext.Provider>
      </SettingsContext.Provider>
    );
  };

  it('should render the SharePathModal and display QR code', async () => {
    initSuccesfulShare();

    // Check if modal content renders
    expect(screen.getByText('Polun jakaminen')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Näytä alla oleva QR-koodi polun vastaanottajalle. QR-koodi tulee lukea Sanapolku-sovelluksen avulla. Jos kamera ei ole käytettävissä, polun jakaminen onnistuu QR-koodin alta löytyvän tunnisteen avulla.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Lähettäjän tunniste:')).toBeInTheDocument();
    expect(screen.getByText('testPeerId')).toBeInTheDocument();

    // Check if QR code is rendered
    expect(screen.getByText('Mocked QR Code')).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    initSuccesfulShare();

    const closeButton = screen.getByText('Palaa takaisin');
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should show success message when sharing succeeds', async () => {
    initSuccesfulShare();

    // Trigger the effect by updating currentPath (this will also call exportPath)
    await waitFor(() => expect(exportPath).toHaveBeenCalledTimes(1));

    // Trigger the effect by updating the exportedPath or peer
    await waitFor(() => expect(sendDataOnConnection).toHaveBeenCalledTimes(1));

    // Ensure the state update occurs and the success message is shown
    await waitFor(() => {
      expect(screen.getByText('Polun jakaminen onnistui!')).toBeInTheDocument();
    });
  });

  it('should show failure modal when sharing fails', async () => {
    initFailureShare();

    // Trigger the effect
    await waitFor(() => expect(sendDataOnConnection).toHaveBeenCalledTimes(1));

    // Check that the failure modal is triggered
    await waitFor(() =>
      expect(pathContextValue.openSharingFailedModal).toHaveBeenCalled()
    );
    expect(
      screen.queryByText('Polun jakaminen onnistui!')
    ).not.toBeInTheDocument();
  });

  it('should reset state when onClose is called', () => {
    initSuccesfulShare();

    // Initially, state should not show success
    expect(
      screen.queryByText('Polun jakaminen onnistui!')
    ).not.toBeInTheDocument();

    // Simulate closing the modal
    fireEvent.click(screen.getByText('Palaa takaisin'));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should call sendDataOnConnection when both peer and exportedPath are available', async () => {
    initSuccesfulShare();

    await waitFor(() =>
      expect(sendDataOnConnection).toHaveBeenCalledWith(
        settingsContextValue.peer,
        {
          name: 'Test Path',
          words: [{ word: 'word1' }, { word: 'word2' }],
        }
      )
    );
  });

  it('should not call sendDataOnConnection if peer or exportedPath are not available', async () => {
    const settingsContextWithoutPeer = { ...settingsContextValue, peer: null };
    const mockPath = { name: 'Test Path' };
    const mockWords = [{ word: 'word1' }, { word: 'word2' }];
    sendDataOnConnection.mockRejectedValueOnce(new Error('Connection failed'));
    exportPath.mockResolvedValueOnce({ name: mockPath.name, words: mockWords });
    render(
      <SettingsContext.Provider value={settingsContextWithoutPeer}>
        <PathContext.Provider value={pathContextValue}>
          <SharePathModal onClose={onCloseMock} />
        </PathContext.Provider>
      </SettingsContext.Provider>
    );

    await waitFor(() => expect(sendDataOnConnection).not.toHaveBeenCalled());
  });
});
