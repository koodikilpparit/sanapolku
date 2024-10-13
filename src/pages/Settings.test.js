import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Settings from "./Settings";
import { SettingsContext } from "../contexts/SettingsContext";

describe("Settings Component", () => {
  const mockSetSounds = jest.fn();
  const mockSetMusic = jest.fn();

  const renderSettings = (sounds = true, music = true) => {
    render(
      <SettingsContext.Provider
        value={{
          sounds,
          setSounds: mockSetSounds,
          music,
          setMusic: mockSetMusic,
        }}
      >
        <Settings />
      </SettingsContext.Provider>
    );
  };

  test("renders settings toggles correctly", () => {
    renderSettings();
    expect(screen.getByText("Äänet")).toBeInTheDocument();
    expect(screen.getByText("Musiikki")).toBeInTheDocument();
  });

  test("toggles sounds setting", () => {
    renderSettings();
    const soundsCheckbox = screen.getByLabelText("Äänet");
    fireEvent.click(soundsCheckbox);
    expect(mockSetSounds).toHaveBeenCalledWith(false);
  });

  test("toggles music setting", () => {
    renderSettings();
    const musicCheckbox = screen.getByLabelText("Musiikki");
    fireEvent.click(musicCheckbox);
    expect(mockSetMusic).toHaveBeenCalledWith(false);
  });
});
