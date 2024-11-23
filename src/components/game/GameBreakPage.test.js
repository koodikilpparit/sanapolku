import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GameBreakPage from './GameBreakPage';

describe('GameBreakPage Component', () => {
  it('Check that break content is rendered', () => {
    const { container } = render(
      <BrowserRouter>
        <GameBreakPage />
      </BrowserRouter>
    );

    const breakContent = container.querySelector('.break-content');
    expect(breakContent).toBeInTheDocument;
  });

  it('Check that the continue button is rendered', async () => {
    const { container } = render(
      <BrowserRouter>
        <GameBreakPage />
      </BrowserRouter>
    );

    const continueButton = container.querySelector('.continue-button');
    expect(continueButton).toBeInTheDocument;
  });

  it('Check that the ending image is rendered', async () => {
    const { container } = render(
      <BrowserRouter>
        <GameBreakPage />
      </BrowserRouter>
    );

    const breakImage = container.querySelector('.break-img');
    expect(breakImage).toBeInTheDocument;
  });

  it('Check that the header is rendered', () => {
    render(
      <BrowserRouter>
        <GameBreakPage />
      </BrowserRouter>
    );

    const breakHeader = screen.getByText('Hienoa!');
    expect(breakHeader).toBeInTheDocument;
  });

  it('Check that all other text is rendered', () => {
    render(
      <BrowserRouter>
        <GameBreakPage />
      </BrowserRouter>
    );

    const breakText1 = screen.getByText(
      'Saavuit levähdyspaikalle! Nyt on aika levätä hieman ennen kuin matka jatkuu.'
    );
    expect(breakText1).toBeInTheDocument;

    const breakText2 = screen.getByText(
      'Pidä pieni tauko ennen kuin jatkat peliä.'
    );
    expect(breakText2).toBeInTheDocument;
  });
});
