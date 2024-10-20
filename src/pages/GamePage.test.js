import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Start from './Start';
import GamePage from './GamePage';

describe('GamePage', () => {
  // Rendering the instructions page
  it('checks if Instructions-page renders', () => {
    render(
      <BrowserRouter>
        <GamePage />
      </BrowserRouter>
    );
  });
});
