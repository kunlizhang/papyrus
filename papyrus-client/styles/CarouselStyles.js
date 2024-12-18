import { StyleSheet, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.tabBarColor,
    },
    card: {
      position: 'absolute',
      width: width,
      height: height,
      backgroundColor: theme.backgroundColor,
      borderRadius: 50,
      overflow: 'hidden',
    },
    textContainer: {
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: '8%',
      paddingBottom: '32%',
      height: '100%',
    },
    cardHeadline: {
      fontSize: scale(45),
      lineHeight: scale(45),
      color: 'white',
      textAlign: 'left',
      paddingTop: scale(20),
      paddingBottom: 0,
      marginBottom: scale(-15),
      fontFamily: theme.headlineFontFamily
    },
    cardSubtitle: {
      fontSize: scale(14),
      fontWeight: 'bold',
      textAlign: 'left',
      color: 'white',
    },
    cardBackground: {
      width: '101%',
      height: '101%',
    },
  });

export default createStyles;
