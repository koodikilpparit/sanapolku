import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Start from './Start';
import Instructions from './Instructions';

describe("StartPage", () => {
    // Rendering the instructions page
    it('checks if Instructions-page renders', () => {
        render(
            <BrowserRouter>
                <Instructions />
            </BrowserRouter>
        );       
    });

    it('checks if back-button brings you to the start page', () => {
        // Rendering the required pages
        const { container } = render(
            <BrowserRouter>
                <Instructions />
                <Start />
            </BrowserRouter>
        );
        
        // Checking that the back-button is on the start page
        const backButton = container.querySelector(".back-button");
        expect(backButton).toBeInTheDocument();
        
        // Checking that by clicking the back-button you can navigate to /
        fireEvent.click(backButton);
        expect(window.location.pathname).toBe('/');
    });

});