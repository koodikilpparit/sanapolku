import React, { useEffect, useState } from 'react';

const Share = () => {
  const [peerID, setPeerID] = useState('');
  const handleShareClick = () => {
    console.log('Share');
  };

  const handleReceiveClick = () => {
    console.log('Receive');
  };

  useEffect(() => {
    console.log('Peer ID', peerID);
  }, [peerID]);

  return (
    <div>
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
  );
};

export default Share;
