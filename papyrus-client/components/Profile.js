import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import createStyles from '../styles/ProfileStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { addInterest, deleteInterest, addRestrictedSource, getInterests } from '../functions/user-actions';
import { scale } from 'react-native-size-matters';

const Profile = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isInterestDropdownOpen, setInterestDropdownOpen] = useState(false);
  const [interestOption, setInterestOption] = useState('');
  const [userInterests, setUserInterests] = useState([]);
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
    { label: 'Art', value: 'Art' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Food', value: 'Food' },
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

  useEffect(() => {
    fetchUserInterests();
  }, []);

  const fetchUserInterests = async () => {
    const interests = await getInterests();
    setUserInterests(interests.interests);
  };

  const handleAddInterest = async () => {
    if (interestOption) {
      await addInterest(interestOption);
      fetchUserInterests();
    }
  };

  const handleDeleteInterest = async (interest) => {
    await deleteInterest(interest);
    fetchUserInterests();
  };

  const handleInterestChange = (itemValue) => {
    setInterestOption(itemValue);
  };

  const handleSourceChange = (itemValue) => {
    setSourceOption(itemValue);
  }

  const handleAddSource = () => {
    if (sourceOption) {
      addRestrictedSource(sourceOption);
    }
  }

  const exampleName = "Armando Christian Pérez"
  const exampleEmail = "mrworldwide305@gmail.com"

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
          <Icon name="edit" size={scale(20)} /> 
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
          {userInterests.map((item, index) => (
              <View key={index} style={styles.interestElement}>
                <Text style={styles.interestElementText}>{item}</Text>
                <Icon name="clear" size={scale(14)} onPress={() => handleDeleteInterest(item)}/>
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
                <Icon name="clear" size={scale(14)} onPress={() => handleDeleteInterest(item)}/>
              </View>
            ))
          }
        </ScrollView>
      </View>
    </View>
  );
};

export default Profile;