import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { Bayon_400Regular } from '@expo-google-fonts/bayon';
import { LibreBaskerville_400Regular } from '@expo-google-fonts/libre-baskerville';
import { SourceSans3_600SemiBold } from '@expo-google-fonts/source-sans-3';
import { scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Bookmarks from './components/Bookmarks';
import Profile from './components/Profile';
import Recommendations from './components/Recommendations';
import Search from './components/Search';
import CarouselData from './assets/mock-recommendations.json';

const Tab = createBottomTabNavigator();

function MainApp() {
  const { theme } = useTheme();

  const [fontsLoaded] = useFonts({
    Bayon_400Regular,
    LibreBaskerville_400Regular,
    SourceSans3_600SemiBold
  });

  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;
  }

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
          borderTopWidth: 0,
          height: scale(65),
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Explore">
        {() => <Recommendations data={CarouselData} />}
      </Tab.Screen>
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Bookmarks" >
        {() => <Bookmarks data={CarouselData} />}
      </Tab.Screen>
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