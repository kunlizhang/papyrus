import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.tabBarColor,
    },
    card: {
      position: 'absolute',
      width: width,
      height: height,
      backgroundColor: theme.backgroundColor,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      top: '50%',
      left: '50%',
      transform: [
        { translateX: -(width * 0.9) / 2 },
        { translateY: -(height * 0.6) / 2 },
      ],
    },
    cardText: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.color, // Example dynamic styling for text
    },
  });

export default createStyles;
