import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('checks if App component renders', () => {
  render(<App />);
});