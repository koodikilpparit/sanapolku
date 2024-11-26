import Peer from 'peerjs';

export const QRCODE_PREFIX = 'sanapolku:';

export async function initializePeer() {
  return new Promise((resolve, reject) => {
    const peer = new Peer();

    peer.on('open', (id) => {
      resolve({ id, peer });
    });

    peer.on('error', (e) => {
      console.error('Could not retrieve own Peer ID:', e);
      reject(e);
    });
  });
}

export async function connectToPeerAndReceive(peer, targetPeerId, callback) {
  return new Promise((resolve, reject) => {
    if (!peer) reject(new Error('Peer not initialized'));
    if (!targetPeerId) reject(new Error('Target peer ID not set'));
    if (!callback) reject(new Error('Callback not set'));

    const connection = peer.connect(targetPeerId, {
      reliable: true,
    });

    connection.off('data'); // Not sure if needed, but should not do any harm either
    connection.on('data', (data) => {
      const asyncCallBack = async (data) => {
        const importedPath = await callback(data);
        resolve(importedPath);
      };
      asyncCallBack(data);
    });
    connection.on('error', (e) => {
      reject(e);
    });
    connection.on('iceStateChanged', (e) => {
      if (e === 'disconnected') {
        reject(e);
      }
    });
  });
}

export async function sendDataOnConnection(peer, data) {
  if (!peer) throw new Error('Peer not initialized');
  if (!data) throw new Error('Must contain data to send');

  return new Promise((resolve, reject) => {
    peer.off('connection');
    peer.on('connection', (connection) => {
      connection.on('open', () => {
        console.log('Sending data', data);
        connection.send(data);
        resolve();
      });
      connection.on('error', (e) => {
        reject(e);
      });
      connection.on('iceStateChanged', (e) => {
        if (e === 'disconnected') {
          reject(e);
        }
      });
    });
  });
}
