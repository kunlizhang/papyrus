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
      fontSize: scale(35),
      lineHeight: scale(35),
      color: 'white',
      textAlign: 'left',
      paddingTop: scale(20),
      paddingBottom: scale(5),
      marginBottom: scale(-15),
      fontFamily: theme.headlineFontFamily
    },
    cardSubtitle: {
      fontSize: scale(12),
      lineHeight: scale(18),
      fontWeight: 'bold',
      textAlign: 'left',
      paddingBottom: scale(5),
      color: 'white',
      fontFamily: theme.paragraphFontFamily
    },
    cardSource: {
      fontSize: scale(12),
      lineHeight: scale(18),
      fontWeight: 'bold',
      textAlign: 'left',
      color: 'white',
      fontFamily: theme.headlineFontFamily
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
    articleView: {
      position: 'absolute',
      width: width,
      height: height * 0.95,
      backgroundColor: '#fff',
      overflow: 'hidden',
    },
    webView: {
      marginTop: "13%",
      overflow: 'hidden',
    },
    closeArticle: {
      width: width,
      textAlign: "center",
      height: scale(40),
      fontSize: scale(40),
      color: 'black', 
      marginTop: '19%',
      fontFamily: theme.iconFontFamily,
    },
  });

export default createStyles;
