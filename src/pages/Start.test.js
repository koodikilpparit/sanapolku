import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Start from './Start';

describe("StartPage", () => {
    it('checks if Start-page renders', () => {
        render(
            <BrowserRouter>
                <Start />
            </BrowserRouter>
        );
    });

    it('checks if settings-button brings you to /asetukset', () => {
        render(
            <BrowserRouter>
                <Start />
            </BrowserRouter>
        );
    });

    it('checks if help-button brings you to /ohjeet', () => {
        render(
            <BrowserRouter>
                <Start />
            </BrowserRouter>
        );
    });

    it('checks if start-button brings you to /polut', () => {
        render(
            <BrowserRouter>
                <Start />
            </BrowserRouter>
        );
    });

});