import React, { createContext, useContext, useState } from 'react';

const themes = {
  light: {
    backgroundColor: '#F8F8F8',
    color: '#000000',
    tabBarColor: '#181818',
    tabBarActiveTintColor: '#FFFFFF',
    tabBarInactiveTintColor: '#979797',
  },
  dark: {
    backgroundColor: '#181818',
    color: '#FFFFFF',
    tabBarColor: '#181818',
    tabBarActiveTintColor: '#FFFFFF',
    tabBarInactiveTintColor: '#979797',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

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

export const useTheme = () => useContext(ThemeContext);
