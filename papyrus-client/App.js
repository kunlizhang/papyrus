import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Bookmarks from './components/Bookmarks';
import Profile from './components/Profile';
import Recommendations from './components/Recommendations';
import Search from './components/Search';

const Tab = createBottomTabNavigator();

function MainApp() {
  const { theme } = useTheme();

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

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: theme.tabBarColor,
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