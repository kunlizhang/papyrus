import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

const entries = [
  { title: 'Recommendation 1' },
  { title: 'Recommendation 2' },
  { title: 'Recommendation 3' },
];

const Recommendations = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Carousel
        loop
        width={screenWidth}
        height={200}
        data={entries}
        renderItem={({ item }) => (
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
            <Text style={{ fontSize: 24 }}>{item.title}</Text>
          </View>
        )}
        autoPlay
      />
    </View>
  );
};

export default Recommendations;
