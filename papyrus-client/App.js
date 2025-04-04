import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { Bayon_400Regular } from '@expo-google-fonts/bayon';
import { LibreBaskerville_400Regular, LibreBaskerville_700Bold } from '@expo-google-fonts/libre-baskerville';
import { SourceSans3_600SemiBold } from '@expo-google-fonts/source-sans-3';
import { scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Bookmarks from './components/Bookmarks';
import Profile from './components/Profile';
import Recommendations from './components/Recommendations';
import Search from './components/Search';
import CarouselData from './assets/mock-recommendations.json';
import { getRecommendedArticlesAsJson, getSavedArticlesAsJson } from './functions/user-actions';

const Tab = createBottomTabNavigator();

function MainApp() {
  const { theme } = useTheme();
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [fontsLoaded] = useFonts({
    Bayon_400Regular,
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
    SourceSans3_600SemiBold
  });

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const recommendations = await getRecommendedArticlesAsJson();
        setRecommendedArticles(recommendations);
        
        const popularArticles = await getRecommendedArticlesAsJson();
        setPopularArticles(popularArticles.sort(() => Math.random() - 0.5).slice(0, 5));

        const saved = await getSavedArticlesAsJson(); 
        setSavedArticles(saved);

      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();

    const intervalId = setInterval(() => {
      const fetchSavedArticles = async () => {
        try {
          const saved = await getSavedArticlesAsJson(); 
          setSavedArticles(saved);
        } catch (error) {
          console.error("Error fetching saved articles:", error);
        }
      };
      
      fetchSavedArticles();
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
        {() => <Recommendations data={recommendedArticles} />}
      </Tab.Screen>
      <Tab.Screen name="Search">
        {() => <Search data={popularArticles} />}
      </Tab.Screen>
      <Tab.Screen name="Bookmarks">
        {() => <Bookmarks data={savedArticles} />}
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