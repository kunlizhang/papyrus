import React, { useRef, useState } from 'react';
import { View, Text, Animated, PanResponder, Dimensions } from 'react-native';
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
        x: gesture.dx / 4,
        y: gesture.dy / 6,
      });
    },
    onPanResponderRelease: (_, gesture) => {
      const swipeThreshold = 120;

      if (gesture.dx > swipeThreshold) {
        Animated.timing(position, {
          toValue: { x: width + 100, y: gesture.dy },
          duration: 200,
          useNativeDriver: false,
        }).start(() => onSwipeComplete('right'));
      } else if (gesture.dx < -swipeThreshold) {
        Animated.timing(position, {
          toValue: { x: -width - 100, y: gesture.dy },
          duration: 200,
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
    const nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex + 1;
    setCurrentIndex(nextIndex < data.length ? nextIndex : 0);

    position.setValue({ x: 0, y: 0 });
  };

  const renderCards = () => {
    return data
      .map((item, index) => {
        if (index < currentIndex) return null;

        const isCurrentCard = index === currentIndex;

        const cardStyle = isCurrentCard
          ? {
              ...position.getLayout(),
              transform: [
                {
                  rotate: position.x.interpolate({
                    inputRange: [-width / 2, 0, width / 2],
                    outputRange: ['-10deg', '0deg', '10deg'],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }
          : { opacity: 0 };

        return (
          <Animated.View
            key={index}
            style={[styles.card, cardStyle]}
            {...(isCurrentCard ? panResponder.panHandlers : {})}
          >
            <Text style={styles.cardText}>{item}</Text>
          </Animated.View>
        );
      })
      .reverse();
  };

  return <View style={styles.container}>{renderCards()}</View>;
};

export default Carousel;
