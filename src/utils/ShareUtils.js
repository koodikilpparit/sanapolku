import Peer from 'peerjs';

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
    if (!peer) reject('Peer not initialized');
    if (!targetPeerId) reject('Target peer ID not set');
    if (!callback) reject('Callback not set');

    const connection = peer.connect(targetPeerId);

    connection.on('open', () => {
      resolve();
    });
    connection.on('data', (data) => {
      callback(data);
    });
    connection.on('error', (e) => {
      console.error(e);
      reject(e);
    });
  });
}

export function sendDataOnConnection(peer, data) {
  if (!peer) throw new Error('Peer not initialized');
  if (!data) throw new Error('Must contain data to send');

  return new Promise((resolve, reject) => {
    peer.on('connection', (connection) => {
      connection.on('open', () => {
        console.log('Sending data', data);
        connection.send(data);
        resolve();
      });
      connection.on('error', (e) => {
        console.error('Connection error', e);
        reject(e);
      });
    });
  });
}
