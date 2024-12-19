import { StyleSheet, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.tabBarColor,
    },
    currentCard: {
      position: 'absolute',
      width: width,
      height: height,
      backgroundColor: theme.backgroundColor,
      borderRadius: 0,
      overflow: 'hidden',
      opacity: 1,
      zIndex: 5,
    },
    nextCard: {
      position: 'absolute',
      width: width,
      height: height,
      backgroundColor: theme.backgroundColor,
      borderRadius: 0,
      overflow: 'hidden',
    },
    textContainer: {
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      paddingHorizontal: '8%',
      paddingBottom: '50%',
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
      fontSize: scale(12),
      lineHeight: scale(18),
      fontWeight: 'bold',
      textAlign: 'left',
      color: 'white',
      fontFamily: theme.paragraphFontFamily
    },
    buttonContainer: {
      position: 'absolute',
      width: width,
      textAlign: "center",
      paddingBottom: "31%",
      fontSize: scale(40), 
      color: '#fff', 
      fontFamily: theme.iconFontFamily
    },
  });

export default createStyles;
