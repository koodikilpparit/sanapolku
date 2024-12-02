import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GameEndingPage from './GameEndingPage';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('GameEndingPage Component', () => {
  it('Check that ending content is rendered', () => {
    const { container } = render(
      <BrowserRouter>
        <GameEndingPage />
      </BrowserRouter>
    );

    const endingContent = container.querySelector('.ending-content');
    expect(endingContent).toBeInTheDocument;
  });

  it('Check that all buttons are rendered', async () => {
    const { container } = render(
      <BrowserRouter>
        <GameEndingPage />
      </BrowserRouter>
    );

    const readyButton = container.querySelector('.ready-button');
    expect(readyButton).toBeInTheDocument;

    const restartButton = container.querySelector('.restart-button');
    expect(restartButton).toBeInTheDocument;
  });

  it('Check that the ending image is rendered', async () => {
    const { container } = render(
      <BrowserRouter>
        <GameEndingPage />
      </BrowserRouter>
    );

    const endingImage = container.querySelector('.ending-img');
    expect(endingImage).toBeInTheDocument;
  });

  it('Check that the header is rendered', () => {
    render(
      <BrowserRouter>
        <GameEndingPage />
      </BrowserRouter>
    );

    const endingHeader = screen.getByText('Onnittelut!');
    expect(endingHeader).toBeInTheDocument;
  });

  it('Check that all other text is rendered', () => {
    render(
      <BrowserRouter>
        <GameEndingPage />
      </BrowserRouter>
    );

    const endingText = screen.getByText(
      'Suoritit koko polun ja saavuit määränpäähäsi!'
    );
    expect(endingText).toBeInTheDocument;
  });

  it('checks that the VALMIS button brings you to the game menu', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Rendering the required pages
    const { container } = render(
      <BrowserRouter>
        <GameEndingPage />
      </BrowserRouter>
    );

    const readyButton = container.querySelector('.ready-button');
    expect(readyButton).toBeInTheDocument();

    fireEvent.click(readyButton);
    expect(mockNavigate).toHaveBeenCalledWith('/polut');
  });

  it('checks that restart button can be used to restart game', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    render(
      <BrowserRouter>
        <GameEndingPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Restart Game/i }));
    expect(mockNavigate).toHaveBeenCalledWith(0);
  });
});
