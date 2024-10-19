import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import GameMenu from './GameMenu';

describe('GameMenu Component', () => {

  it('renders the title', () => {
    render(
      <BrowserRouter>
        <GameMenu />
      </BrowserRouter>
    );

    // Checks that title renders
    expect(screen.getByText('Valitse polku')).toBeInTheDocument();
  });

  it('renders the path buttons', () => {

    render(
      <BrowserRouter>
        <GameMenu />
      </BrowserRouter>
    );

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

  /* TODO: when Aikuisten polku and Lasten polku are implemented

  it('navigates to "Aikuisten polku" when the button is clicked', async () => {

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/aikuistenpolku" element={<div>Aikuisten polku sivu</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Simulates clicking button
    fireEvent.click(screen.getByRole('button', { name: 'Aikuisten polku' }));

    //Checks that navigating works
    await waitFor(() => {
      expect(screen.getByText('Aikuisten polku sivu')).toBeInTheDocument();
    });
  });

  it('navigates to "Lasten polku" when the button is clicked', async () => {
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/lastenpolku" element={<div>Lasten polku sivu</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Simulates clicking button
    fireEvent.click(screen.getByRole('button', { name: 'Lasten polku' }));

    // Checks that navigating works
    await waitFor(() => {
      expect(screen.getByText('Lasten polku sivu')).toBeInTheDocument();
    });
  }); */

  it('navigates to "Omat polut" when the button is clicked', async () => {

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/omatpolut" element={<div>Omat polut sivu</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Simulates clicking button
    fireEvent.click(screen.getByRole('button', { name: 'Omat polut' }));

    // Checks that navigating works
    await waitFor(() => {
      expect(screen.getByText('Omat polut sivu')).toBeInTheDocument();
    });
  });
});
