"use client";
import React, { createContext, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const theme = {
    colors: {
      primary: "cinema-gold",
      secondary: "white",
      background: "cinema-blue",
      text: "white",
      hover: "cinema-blue-light",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
