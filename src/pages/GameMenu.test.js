import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GameMenu from './GameMenu';

describe('GameMenu Component', () => {
  beforeEach(() => {
    // Renders game menu before every test
    render(
      <BrowserRouter>
        <GameMenu />
      </BrowserRouter>
    );
  });

  it('renders the title', () => {
    // Checks that title renders
    expect(screen.getByText('Valitse polku')).toBeInTheDocument();
  });

  it('renders the path buttons', () => {
    // Checks that every button renders
    expect(
      screen.getByRole('button', { name: 'Aikuisten polku' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Lasten polku' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Omat polut' })
    ).toBeInTheDocument();
  });
});
