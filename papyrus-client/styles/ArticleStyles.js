import { StyleSheet, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const createStyles = (theme) =>
  StyleSheet.create({
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
    navBar: {
      width: width, 
      height: scale(80),
      backgroundColor: 'black',
      marginBottom: -50, 
    },
    buttonContainer: {
      position: 'absolute',
      textAlign: "center",
      marginTop: scale(5),
      fontSize: scale(25), 
      marginLeft: "50%",
      color: '#fff', 
      fontFamily: theme.iconFontFamily,
      transform: [{ rotate: '180deg' }],
    },
    skipButton: {
      position: 'absolute', 
      color: '#fff',
      marginTop: scale(15),
      marginLeft: scale(270)
    },
    bookmarkButton: {
      position: 'absolute', 
      color: '#fff',
      marginTop: scale(15),
      marginLeft: scale(302)
    }
  });

export default createStyles;
