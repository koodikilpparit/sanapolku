import { render } from '@testing-library/react';
import React from 'react';
import { SettingsContext } from './contexts/SettingsContext';

import App from './App';

test('checks if App component renders', () => {
  const mockSettings = {
    music: true,
    volume: 0.5,
  };
  render(
    <SettingsContext.Provider value={mockSettings}>
      <App />
    </SettingsContext.Provider>
  );
});
