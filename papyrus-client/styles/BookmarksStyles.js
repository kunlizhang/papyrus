import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        padding: scale(20),
        paddingTop: scale(60),
    },
    heading: {
        fontSize: scale(30),
        color: 'black',
        textAlign: 'left',
        paddingBottom: scale(3),
        fontFamily: theme.headlineFontFamily
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(-15),
        marginLeft: scale(-20),
        marginRight: scale(-20)
    },
    arrowButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 50,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    arrowText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        borderRadius: 11,
        paddingVertical: 0,
        paddingHorizontal: 15,
        marginRight: 10,
        borderColor: theme.buttonFill,
        borderWidth: 2,
    },
    buttonText: {
        fontSize: scale(11),
        fontFamily: theme.headlineFontFamily
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(-7)
    },
    sortByLabel: {
        fontSize: scale(10),
        fontFamily: theme.paragraphFontFamily,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 10,
    },
    dropdown: {
        borderColor: '#ccc',
        borderRadius: 5,
        minHeight: 25,
        paddingVertical: 0,
    },
    dropdownContainerStyle: {
        width: '40%',
    },
    dropdownText: {
        fontSize: scale(11),
        fontFamily: theme.headlineFontFamily,
        color: '#333',
    },
    dropdownContent: {
        borderColor: '#ccc',
        paddingVertical: 2,
    },
    articles: {
        marginTop: scale(20),
        marginLeft: scale(-25),
        marginRight: scale(-25),
        marginBottom: scale(-25),
        borderTopColor: theme.buttonFill,
        borderWidth: 2
    },
    articleContainer: {
        padding: scale(20),
        paddingVertical: scale(20),
        borderBottomColor: theme.buttonFill,
        borderBottomWidth: 2,
    },
    lastArticleContainer: {
        padding: scale(20),
        paddingTop: scale(10),
        paddingBottom: scale(40),
    },
    savedArticle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    articleLeft: {
        width: "55%",
        marginRight: 0,
        paddingRight: scale(8),
    },
    articleHeading: {
        color: 'black',
        paddingTop: scale(8),
        fontFamily: theme.headlineFontFamily,
        fontSize: scale(20),
        lineHeight: scale(20),
        marginBottom: 0,
    },
    articleSubheading: {
        color: 'black',
        marginTop: scale(-3),
        paddingTop: scale(1),
        fontFamily: theme.paragraphFontFamily,
        fontSize: scale(12),
        lineHeight: scale(12),
    },
    articleRight: {
        width: "45%",
        marginLeft: 0,
    },
    articleImage: {
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'cover',     
    },
    articleBottom: {
        marginTop: scale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    articleAuthors: {
        color: theme.accentColor,
        paddingTop: scale(8),
        marginBottom: scale(-5),
        fontFamily: theme.headlineFontFamily,
        fontSize: scale(12),
        lineHeight: scale(12),
    },
    articleDate: {
        paddingTop: scale(6),
        fontFamily: theme.paragraphFontFamily,
        fontSize: scale(10),
        lineHeight: scale(10),
    }
  });

export default createStyles;
