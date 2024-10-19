import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppStyles from '../styles/AppStyles';

const Bookmarks = () => {
  const { theme } = useTheme();

  return (
    <View style={[AppStyles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={{ color: theme.color }}>Saved</Text>
    </View>
  );
};

export default Bookmarks;
