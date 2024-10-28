import React, { useEffect, useState } from 'react';
import serializePath from '../utils/SerializePath';

const Share = () => {
  const [peerID, setPeerID] = useState('');
  const [selectedPathName, setSelectedPathName] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);

  const handleShareClick = () => {
    console.log('Share');
  };

  const handleReceiveClick = () => {
    console.log('Receive');
  };

  const handlePathSelectionClick = async () => {
    serializePath(selectedPathName).then((serializedPath) => {
      setSelectedPath(serializedPath);
    });
  };

  useEffect(() => {
    console.log('Peer ID', peerID);
    console.log('Selected path', selectedPath);
  }, [peerID, selectedPath]);

  return (
    <div>
      <div className="path-selection">
        <label>
          Jaettavan polun nimi
          <input
            type="text"
            value={selectedPathName}
            onChange={(e) => setSelectedPathName(e.target.value)}
          />
        </label>
        <button onClick={handlePathSelectionClick}>Hae polku</button>
      </div>
      <div className="share-container">
        <label>
          Toisen käyttäjän ID
          <input
            type="text"
            value={peerID}
            onChange={(e) => setPeerID(e.target.value)}
          />
        </label>
        <button onClick={handleShareClick}>Testaa jakamista</button>
        <button onClick={handleReceiveClick}>Testaa vastaanottamista</button>
      </div>
    </div>
  );
};

export default Share;
