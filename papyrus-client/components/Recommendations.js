import React, { useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, Dimensions, ImageBackground } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import createStyles from '../styles/RecommendationStyles';
import Article from './Article';
import { handleBookmark, handleRead, handleSkip, SwipeStatus } from '../functions/user-actions';

const { width, height } = Dimensions.get('window');

const Recommendations = ({ data }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const position = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwipingUp, setIsSwipingUp] = useState(false);

  const slideAnim = useRef(new Animated.Value(200)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const minSwipeThreshold = 30;
      if (Math.abs(gesture.dx) > minSwipeThreshold) {
        position.setValue({
          x: gesture.dx / 1.5,
          y: 0,
        });
      } else {
        position.setValue({
          x: 0,
          y: 0,
        });
      }
    },
    onPanResponderRelease: (_, gesture) => {
      const swipeThreshold = 120;
      const swipeUpThreshold = -120;

      if (gesture.dx > swipeThreshold) {
        Animated.timing(position, {
          toValue: { x: width, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => onSwipeComplete(SwipeStatus.RIGHT));
      } else if (gesture.dx < -swipeThreshold) {
        Animated.timing(position, {
          toValue: { x: -width, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => onSwipeComplete(SwipeStatus.LEFT));
      } else if (gesture.dy < swipeUpThreshold) {
        handleSwipeUp();
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const onSwipeComplete = (direction) => {
    const currentCard = data[currentIndex];
    if (direction == SwipeStatus.LEFT) {
      handleSkip(currentCard);
    } 
    if (direction == SwipeStatus.RIGHT) {
      handleBookmark(currentCard);
    }
  
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex < data.length ? nextIndex : 0);
  
    position.setValue({ x: 0, y: 0 });
  };
  
  const handleSwipeUp = () => {
    const currentCard = data[currentIndex];
    handleRead(currentCard);
    
    slideAnim.setValue(300);
    fadeAnim.setValue(0);

    setIsSwipingUp(true);

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

  const handleSwipeDown = () => {
    slideAnim.setValue(0);
    fadeAnim.setValue(1);

    Animated.timing(slideAnim, {
      toValue: height,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsSwipingUp(false);
    });
  }

  const renderCards = () => {
    return data
      .map((item, index) => {
        const isCurrentCard = index === currentIndex;
        const isNextCard = index === (currentIndex + 1) % data.length;

        if (!isCurrentCard && !isNextCard) {
          return null;
        }
  
        const currentCardStyle = 
          {
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
              source={{ uri: item.cover_image_url }}
              resizeMode="cover"
            >
              <View style={styles.textContainer}>
                <Text style={styles.cardHeadline}>{item.article_name.substring(0, item.article_name.lastIndexOf("-")).trim()}</Text>
                <Text style={styles.cardSubtitle}>{item.article_desc}</Text>
                <Text style={styles.cardSource}>{item.article_name.substring(item.article_name.lastIndexOf("-") + 1).trim()}</Text>
                <Text style={styles.buttonContainer} onPress={handleSwipeUp}>⌃</Text>
              </View>
            </ImageBackground>
          </Animated.View>
        );
      })
  };  

  return (
    <View style={styles.container}>
      {
        isSwipingUp ?
        <Animated.View 
          style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}
        >
          <Article currentArticle={data[currentIndex]} handleSwipeDown={handleSwipeDown} />
        </Animated.View> : 
        renderCards() 
      }      
    </View>
  )
};

export default Recommendations;
