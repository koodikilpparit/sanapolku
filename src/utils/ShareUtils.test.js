import {
  sendDataOnConnection,
  connectToPeerAndReceive,
  initializePeer,
} from './ShareUtils';
import Peer from 'peerjs';

// Mock the PeerJS library
jest.mock('peerjs');

describe('ShareUtils', () => {
  const mockPeer = { on: jest.fn(), off: jest.fn(), connect: jest.fn() };
  const mockConnection = { on: jest.fn(), send: jest.fn(), off: jest.fn() };
  const mockData = { someField: 'someData' };
  const mockTargetPeerId = '123';
  const mockPeerId = '987';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialize peer', () => {
    test('Sets event listeners', async () => {
      const mockPeer = { on: jest.fn() };
      Peer.mockImplementation(() => mockPeer);

      initializePeer();
      expect(mockPeer.on).toHaveBeenCalledWith('open', expect.any(Function));
      expect(mockPeer.on).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });

  describe('Connect to peer and receive', () => {
    test('Reject if called without peer', async () => {
      expect(
        connectToPeerAndReceive(undefined, mockTargetPeerId, () => {})
      ).rejects.toThrow(Error);
    });
    test('Reject if called without target peer ID', async () => {
      expect(
        connectToPeerAndReceive(mockPeer, undefined, () => {})
      ).rejects.toThrow(Error);
    });
    test('Reject if called without callback', async () => {
      expect(
        connectToPeerAndReceive(mockPeer, mockTargetPeerId, undefined)
      ).rejects.toThrow(Error);
    });

    test('Sets event listeners', async () => {
      mockPeer.connect.mockReturnValueOnce(mockConnection);

      connectToPeerAndReceive(mockPeer, mockTargetPeerId, () => {});

      expect(mockPeer.connect).toHaveBeenCalledWith(
        mockTargetPeerId,
        expect.anything()
      );
      expect(mockConnection.off).toHaveBeenCalledWith('data');
      expect(mockConnection.on).toHaveBeenCalledWith(
        'data',
        expect.any(Function)
      );

      expect(mockConnection.on).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );

      expect(mockConnection.on).toHaveBeenCalledWith(
        'iceStateChanged',
        expect.any(Function)
      );
    });
  });

  describe('Send data on connection', () => {
    test('Reject if called without peer', async () => {
      expect(sendDataOnConnection(undefined, mockData)).rejects.toThrow(Error);
    });

    test('Reject if called without data', async () => {
      expect(sendDataOnConnection(mockPeer, undefined)).rejects.toThrow(Error);
    });

    test('Calls correct peer event listeners', () => {
      sendDataOnConnection(mockPeer, mockData);

      expect(mockPeer.off).toHaveBeenCalledWith('connection');
      expect(mockPeer.on).toHaveBeenCalledWith(
        'connection',
        expect.any(Function)
      );
    });
  });
});
