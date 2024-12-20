import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AppStyles from '../styles/AppStyles';

const Profile = () => {
  const { theme } = useTheme();

  return (
    <View style={[AppStyles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={{ color: theme.color }}>Profile</Text>
    </View>
  );
};

export default Profile;