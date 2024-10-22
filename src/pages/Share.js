import React, { useEffect, useState } from 'react';
import './Start.css'; // Lol liian laiska tekee ees mitää css tiedostoo napille
import Peer from 'peerjs';

const Share = () => {
  const [peerId, setPeerId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [connection, setConnection] = useState(null);

  const handleShareClick = () => {
    console.log('Share');
    connectToPeer();
  };

  const handleReceiveClick = () => {
    console.log('Receive');
  };

  const connectToPeer = () => {
    const conn = connection.connect(remoteId);
    conn.on('open', () => {
      conn.send('Hello from ' + peerId);
    });
  };

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('My ID: ', id);
    });

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        console.log('Received', data);
      });
    });

    setConnection(peer);

    return () => {
      peer.destroy();
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        value={remoteId}
        onChange={(e) => setRemoteId(e.target.value)}
        placeholder="Enter remote peer ID"
      />
      <button className="start-button" onClick={handleShareClick}>
        Testaa jakamista
      </button>
      <button className="start-button" onClick={handleReceiveClick}>
        Testaa vastaanottamista
      </button>
    </div>
  );
};

export default Share;
