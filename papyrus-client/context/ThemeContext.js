import React, { createContext, useContext, useState } from 'react';

const themes = {
  light: {
    backgroundColor: '#F8F8F8',
    color: '#000000',
    tabBarColor: '#000000',
    tabBarActiveTintColor: '#FFFFFF',
    tabBarInactiveTintColor: '#979797',
    headlineFontFamily: 'Bayon_400Regular',
    paragraphFontFamily: 'LibreBaskerville_400Regular',
    iconFontFamily: 'SourceSans3_600SemiBold',
    iconSize: 26
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
