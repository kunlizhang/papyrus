import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import createStyles from '../styles/SearchStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';

const Search = ({ data }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');

  const exampleTrending = ["Eagles win Super Bowl", "Taylor Swift", "New bill passes in Congress", "Kanye runs for President", 
    "Pete Davidson engaged again", "World keeps getting hotter"
  ]

  return (
    <View style={styles.container}>
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
            <View key={index} style={styles.popularItem}>
              <Image 
                source={{ uri: item.background }} 
                style={styles.popularItemImage} 
              />
              <Text style={styles.popularItemHeading}>{item.heading}</Text>
              <Text style={styles.popularItemSubheading}>{item.subheading}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Search;
