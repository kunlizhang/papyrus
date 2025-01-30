import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../context/ThemeContext';
import { scale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import createStyles from '../styles/BookmarksStyles';

const Bookmarks = ({ data }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const scrollViewRef = useRef(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const genres = [
    'Politics',
    'Technology',
    'Health',
    'Sports',
    'Entertainment',
    'Science',
    'World',
    'Finance',
    'Education',
  ];

  const sortOptions = [
    { label: '', value: null },
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Trending', value: 'trending' },
  ];

  const handleScroll = (direction) => {
    const offset = scale(200);
    const newPosition = direction === 'right' 
      ? scrollPosition + offset 
      : Math.max(scrollPosition - offset, 0);

    setScrollPosition(newPosition);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: newPosition, animated: true });
    }
  };

  const handlePress = (genre) => {
    setSelectedGenre(genre);
    console.log(`Selected genre: ${genre}`);
  };

  const handleSortChange = (itemValue) => {
    setSortOption(itemValue);
    console.log(`Sort by: ${itemValue}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Saved Articles</Text>
      <View style={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handleScroll('left')}
        >
          <Icon name="chevron-left" size={20} /> 
        </TouchableOpacity>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {genres.map((genre, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                {
                  backgroundColor:
                    selectedGenre === genre ? theme.buttonFill : theme.tabBarActiveTintColor,
                },
              ]}
              onPress={() => handlePress(genre)}
            >
              <Text style={styles.buttonText}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handleScroll('right')}
        >
          <Icon name="chevron-right" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.dropdownContainer}>
        <Text style={styles.sortByLabel}>SORT BY</Text>
        <DropDownPicker
          maxHeight={200}
          open={isDropdownOpen}
          value={sortOption}
          items={sortOptions}
          setOpen={setDropdownOpen}
          setValue={setSortOption}
          onChangeValue={handleSortChange}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainerStyle}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContent}
          placeholder={''}
        />
      </View>
      <ScrollView style={styles.articles}> 
        {data.map((item, index) => (
          <View key={index} style={index == data.length - 1 ? styles.lastArticleContainer : styles.articleContainer}>
            <View style={styles.savedArticle}>
              <View style={styles.articleLeft}>
                <Text style={styles.articleHeading}>{item.heading}</Text>
                <Text style={styles.articleSubheading}>{item.subheading}</Text>
              </View>
              <View style={styles.articleRight}>
                <Image 
                  source={{ uri: item.background }} 
                  style={styles.articleImage} 
                />
              </View>
            </View>
            <View style={styles.articleBottom}>
              <Text style={styles.articleAuthors}>{item.authors.join(', ')}</Text>
              <Text style={styles.articleDate}>{item.date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Bookmarks;
