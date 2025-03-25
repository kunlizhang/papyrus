import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import createStyles from '../styles/SearchStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';
import Article from './Article';

const Search = ({ data }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isArticleOpen, setArticleOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const slideAnim = useRef(new Animated.Value(200)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const exampleTrending = ["Trump Administration", "US Officials Greenland Visit", "March Madness", "\"The White Lotus\"", 
    "Red Fire Ant Hospitalizations", "Russia-Ukraine War"
  ]
  
  const handleOpenArticle = (article) => {
    setCurrentArticle(article);
    setArticleOpen(true);

    slideAnim.setValue(300);
    fadeAnim.setValue(0);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseArticle = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setArticleOpen(false);
      setCurrentArticle(null);
    });

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {isArticleOpen ? (
        <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}>
          <Article currentArticle={currentArticle} handleSwipeDown={handleCloseArticle} />
        </Animated.View>
      ) : (
        <View style={styles.exploreContainer}>
          <Text style={styles.heading}>Trending</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
              placeholderTextColor="#000"
            />
            <Icon name="search" size={scale(20)} style={styles.searchIcon} /> 
          </View>
          <View style={styles.trendingContainer}>
            {exampleTrending.map((item, index) => (
              <View key={index} style={styles.trendingItem}>
                <Icon name="local-fire-department" size={scale(15)} style={styles.trendingIcon}/>
                <Text style={styles.trendingTopic}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.mostPopularContainer}>
            <Text style={styles.popularHeading}>Most Popular</Text>
            <ScrollView 
              horizontal={true} 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollContainer}>
              {data.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.popularItem}
                  onPress={() => handleOpenArticle(item)}
                >
                  <Image 
                    source={{ uri: item.cover_image_url ? item.cover_image_url : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' }} 
                    style={styles.popularItemImage} 
                  />
                  <Text style={styles.popularItemHeading}>{item.article_name.substring(0, item.article_name.lastIndexOf("-")).trim()}</Text>
                  <Text style={styles.popularItemSubheading}>
                    {item.article_desc.substring(0, 150).endsWith('.') ? 
                      item.article_desc.substring(0, 150) + '..' : 
                      item.article_desc.substring(0, 150) + '...'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default Search;
