import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Start from './Start';
import Instructions from './Instructions';

describe('StartPage', () => {
  it('checks if Instructions-page renders', () => {
    const { getByText, getByAltText } = render(
      <BrowserRouter>
        <Instructions />
      </BrowserRouter>
    );

    expect(getByText('Pelin ohjeet')).toBeInTheDocument();
    expect(getByText('Vaihe 1 – KUVA')).toBeInTheDocument();
    expect(getByText('Vaihe 2 – JÄRJESTÄ')).toBeInTheDocument();
    expect(getByText('Vaihe 3 – KOPIOI')).toBeInTheDocument();
    expect(getByText('Vaihe 4 – TOISTA')).toBeInTheDocument();

    expect(getByAltText('Vaihe 1 – KUVA')).toBeInTheDocument();
    expect(getByAltText('Vaihe 2 – JÄRJESTÄ')).toBeInTheDocument();
    expect(getByAltText('Vaihe 3 – KOPIOI')).toBeInTheDocument();
    expect(getByAltText('Vaihe 4 – TOISTA')).toBeInTheDocument();
  });

  it('checks if back-button brings you to the start page', () => {
    const { container } = render(
      <BrowserRouter>
        <Instructions />
        <Start />
      </BrowserRouter>
    );

    const backButton = container.querySelector('.back-button');
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(window.location.pathname).toBe('/');
  });
});
