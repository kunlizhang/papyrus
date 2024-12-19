import React, { useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, Dimensions, ImageBackground } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import createStyles from '../styles/CarouselStyles';

const { width, height } = Dimensions.get('window');

const Carousel = ({ data }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const position = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({
        x: gesture.dx / 2,
        y: 0
      });
    },
    onPanResponderRelease: (_, gesture) => {
      const swipeThreshold = 120;

      if (gesture.dx > swipeThreshold) {
        Animated.timing(position, {
          toValue: { x: width, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => onSwipeComplete('right'));
      } else if (gesture.dx < -swipeThreshold) {
        Animated.timing(position, {
          toValue: { x: -width, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => onSwipeComplete('left'));
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const onSwipeComplete = (direction) => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex < data.length ? nextIndex : 0);

    position.setValue({ x: 0, y: 0 });
  };

  const renderCards = () => {
    return data
      .map((item, index) => {

        const isCurrentCard = index === currentIndex;
        const isNextCard = index === (currentIndex + 1) % data.length;
  
        const currentCardStyle = isCurrentCard
          ? {
              ...position.getLayout(),
              opacity: 1,
              transform: [
                {
                  translateX: position.x.interpolate({
                    inputRange: [-width, 0, width],
                    outputRange: [0, 0, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }
          : { opacity: 0 };
        
        const nextCardStyle = isNextCard
          ? {
              opacity: position.x.interpolate({
                inputRange: [-width, 0, width],
                outputRange: [1, 0, 1],
                extrapolate: 'clamp',
              }),
            }
          : { opacity: 0 }; 

        const panHandlers = isCurrentCard ? panResponder.panHandlers : {};
  
        return (
          <Animated.View
            key={index}
            style={isCurrentCard ? [styles.currentCard, currentCardStyle] : [styles.nextCard, nextCardStyle]}
            {...panHandlers}
          >
            <ImageBackground
              source={{ uri: item.background }}
              resizeMode="cover"
            >
              <View style={styles.textContainer}>
                <Text style={styles.cardHeadline}>{item.heading}</Text>
                <Text style={styles.cardSubtitle}>{item.subheading}</Text>
              </View>
            </ImageBackground>
          </Animated.View>
        );
      })
  };  

  return <View style={styles.container}>{renderCards()}</View>;
};

export default Carousel;
