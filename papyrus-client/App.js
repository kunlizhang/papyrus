import React from 'react';
import { View, Text, Animated, PanResponder, Dimensions, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, Bayon_400Regular } from '@expo-google-fonts/bayon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Bookmarks from './components/Bookmarks';
import Profile from './components/Profile';
import Recommendations from './components/Recommendations';
import Search from './components/Search';

const Tab = createBottomTabNavigator();

function MainApp() {
  const { theme } = useTheme();

  const [fontsLoaded] = useFonts({
    Bayon_400Regular,
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Explore') {
            iconName = 'book';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Bookmarks') {
            iconName = 'bookmark';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Icon name={iconName} size={size} color={color} style={{ marginTop: 5 }} />;
        },
        tabBarLabel: () => null,
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: theme.tabBarColor,
          borderTopWidth: 0
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Explore" component={Recommendations} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Bookmarks" component={Bookmarks} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </ThemeProvider>
  );
}