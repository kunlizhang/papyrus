import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import createStyles from '../styles/ProfileStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { addInterest, deleteInterest, addRestrictedSource } from '../functions/user-actions';

const Profile = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isInterestDropdownOpen, setInterestDropdownOpen] = useState(false);
  const [interestOption, setInterestOption] = useState('');

  const [isSourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [sourceOption, setSourceOption] = useState('');

  const interestOptions = [
    { label: '', value: null },
    { label: 'Politics', value: 'Politics' },
    { label: 'World News', value: 'World News' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Climate', value: 'Climate' },
    { label: 'Science', value: 'Science' },
    { label: 'Education', value: 'Education' },
    { label: 'Arts', value: 'Arts' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Entertainment', value: 'Entertainment' },
  ];

  const sourceOptions = [
    { label: '', value: null },
    { label: 'BBC News', value: 'BBC News' },
    { label: 'CNN', value: 'CNN' },
    { label: 'The New York Times', value: 'The New York Times' },
    { label: 'The Guardian', value: 'The Guardian' },
    { label: 'Reuters', value: 'Reuters' },
    { label: 'Al Jazeera', value: 'Al Jazeera' },
    { label: 'Fox News', value: 'Fox News' },
    { label: 'Associated Press', value: 'Associated Press' },
    { label: 'Bloomberg', value: 'Bloomberg' },
    { label: 'NPR', value: 'NPR' },
  ];

  const handleInterestChange = (itemValue) => {
    setInterestOption(itemValue);
  };

  const handleSourceChange = (itemValue) => {
    setSourceOption(itemValue);
  }

  const handleAddInterest = () => {
    if (interestOption) {
      addInterest(interestOption);
    }
  }

  const handleAddSource = () => {
    if (sourceOption) {
      addRestrictedSource(sourceOption);
    }
  }

  const handleDeleteInterest = (interest) => {
    deleteInterest(interest)
  }

  const exampleName = "Armando Christian Pérez"
  const exampleEmail = "mrworldwide305@gmail.com"
  const exampleInterests = ["Politics", "World News", "Technology", "Climate", "Arts", "Sports", "Entertainment"]
  const exampleSources = ["Breitbart News", "InfoWars", "BuzzFeed"]

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <View>
        <Image 
          source={require('../assets/example-pfp.jpg')}
          style={styles.profileImage} 
        />
        <TouchableOpacity
          style={styles.editImage}
        >
          <Icon name="edit" size={20} /> 
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.userName}>{exampleName}</Text>
        <Text style={styles.userEmail}>{exampleEmail}</Text>
        <Text></Text>
      </View>
      <View style={styles.interestsContainer}>
        <Text style={styles.userInterests}>Your Interests</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            maxHeight={200}
            open={isInterestDropdownOpen}
            value={interestOption}
            items={interestOptions}
            setOpen={setInterestDropdownOpen}
            setValue={setInterestOption}
            onChangeValue={handleInterestChange}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainerStyle}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContent}
            placeholder={''}
          />
          <Text style={styles.addInterestButton} onPress={handleAddInterest}>add</Text>
        </View>
        <ScrollView style={styles.userInterestScrollView} contentContainerStyle={styles.userInterestList}>
          {exampleInterests.map((item, index) => (
              <View key={index} style={styles.interestElement}>
                <Text style={styles.interestElementText}>{item}</Text>
                <Icon name="clear" size={14} onPress={() => handleDeleteInterest(item)}/>
              </View>
            ))
          }
        </ScrollView>
      </View>
      <View style={styles.restrictedContainer}>
        <Text style={styles.restrictedSources}>Restricted Sources</Text>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            maxHeight={200}
            open={isSourceDropdownOpen}
            value={sourceOption}
            items={sourceOptions}
            setOpen={setSourceDropdownOpen}
            setValue={setSourceOption}
            onChangeValue={handleSourceChange}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainerStyle}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContent}
            placeholder={''}
          />
          <Text style={styles.addSourceButton} onPress={handleAddSource}>add</Text>
        </View>
        <ScrollView style={styles.userSourceScrollView} contentContainerStyle={styles.userSourceList}>
          {exampleSources.map((item, index) => (
              <View key={index} style={styles.sourceElement}>
                <Text style={styles.sourceElementText}>{item}</Text>
                <Icon name="clear" size={14} onPress={() => handleDeleteInterest(item)}/>
              </View>
            ))
          }
        </ScrollView>
      </View>
    </View>
  );
};

export default Profile;