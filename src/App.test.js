import { render } from '@testing-library/react';
import React from 'react';

import App from './App';

test('checks if App component renders', () => {
  render(<App />);
});
