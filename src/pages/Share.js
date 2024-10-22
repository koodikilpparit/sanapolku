import React from 'react';
import './Start.css'; // Lol liian laiska tekee ees mitää css tiedostoo napille
import SignalHub from 'signalhub';

const hub = SignalHub('sanapolku', [
  'https://signalhub-jccqtwhdwc.now.sh',
  'https://signalhub-hzbibrznqa.now.sh',
]);

const handleShareClick = () => {
  console.log('Share');
  hub.broadcast('my-channel', { hello: 'world' });
};

const handleReceiveClick = () => {
  console.log('Receive');
  hub.subscribe('my-channel', (message) => {
    console.log('Received', message);
  });
};

const Share = () => {
  return (
    <div>
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
