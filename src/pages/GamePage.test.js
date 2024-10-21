import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GamePage from './GamePage';

describe('GamePage', () => {
  // Rendering the instructions page
  it('checks if Game-page renders', () => {
    render(
      <BrowserRouter>
        <GamePage />
      </BrowserRouter>
    );
  });
});
