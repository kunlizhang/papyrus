import React, { useRef, useState, useEffect } from 'react';
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

  const [filteredData, setFilteredData] = useState(data);

  const genres = [
    'Business',
    'Entertainment',
    'Sports',
    'Health',
    'Politics',
    'Technology',
    'Science',
    'World',
    'General',
  ];

  const sortOptions = [
    { label: '', value: null },
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Most Popular', value: 'popular' },
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
    if (genre === selectedGenre) {
      setSelectedGenre(null);
      console.log(`Selected genre: none`);
    } else {
      setSelectedGenre(genre);
      console.log(`Selected genre: ${genre}`);
    }
  };

  const handleSortChange = (itemValue) => {
    setSortOption(itemValue);
  };

  useEffect(() => {
    let filtered = data;

    if (selectedGenre) {
      filtered = filtered.filter(item => item.categories.includes(selectedGenre.toLowerCase()));
    }

    if (sortOption) {
      switch (sortOption) {
        case 'newest':
          filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'oldest':
          filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'popular':
          filtered = filtered.sort((a, b) => b.popularity - a.popularity);
          break;
        default:
          break;
      }
    }

    setFilteredData(filtered);

  }, [selectedGenre, sortOption, data]);

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
        {filteredData.map((item, index) => (
          <View key={index} style={index == data.length - 1 ? styles.lastArticleContainer : styles.articleContainer}>
            <View style={styles.savedArticle}>
              <View style={styles.articleLeft}>
                <Text style={styles.articleHeading}>{item.article_name}</Text>
                <Text style={styles.articleSubheading}>
                  {item.article_desc.substring(0, 150).endsWith('.') ? 
                    item.article_desc.substring(0, 150) + '..' : 
                    item.article_desc.substring(0, 150) + '...'}
                </Text>
              </View>
              <View style={styles.articleRight}>
              <Image 
                source={{ uri: item.cover_image_url ? item.cover_image_url : 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg' }} 
                style={styles.articleImage} 
              />
              </View>
            </View>
            <View style={styles.articleBottom}>
              <Text style={styles.articleDate}>
                {item.date ? item.date.split("T")[0] : ""}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Bookmarks;
