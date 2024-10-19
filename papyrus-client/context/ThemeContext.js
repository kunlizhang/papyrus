import React, { createContext, useContext, useState } from 'react';

// Define themes
const themes = {
  light: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    cardBackground: '#F8F8F8',
    tabBarColor: '#FFFFFF',
    tabBarActiveTintColor: 'green',
    tabBarInactiveTintColor: 'gray',
  },
  dark: {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
    cardBackground: '#333333',
    tabBarColor: '#000000',
    tabBarActiveTintColor: 'lightgreen',
    tabBarInactiveTintColor: 'gray',
  },
};

// Create context
const ThemeContext = createContext();

// Theme provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light); // Default theme

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === themes.light ? themes.dark : themes.light
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);
