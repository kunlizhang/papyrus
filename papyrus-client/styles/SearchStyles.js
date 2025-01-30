import { StyleSheet, Dimensions } from 'react-native';
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
        fontFamily: theme.headlineFontFamily,
    },
    searchBar: {
        backgroundColor: theme.buttonFill,
        marginTop: scale(-5),
        paddingLeft: 15,
        paddingRight: 30,
        paddingTop: 5, 
        paddingBottom: 5,
        borderRadius: 20,
    },
    searchIcon: {
        position: 'absolute',
        top: scale(-1), 
        right: scale(10)
    },
    trendingContainer: {
        marginTop: scale(8),
        height: '27%',
        marginBottom: scale(-30)
    },
    trendingItem: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: scale(4)
    },
    trendingIcon: {
        color: '#000',
        shadowColor: '#000',
        shadowOffset: { width: scale(1), height: scale(2.5) },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    trendingTopic: {
        fontSize: scale(12),
        fontFamily: theme.paragraphFontFamily,
        color: 'black',
        paddingLeft: scale(6),
        paddingTop: scale(1),
    },
    mostPopularContainer: {
        backgroundColor: 'black',
        height: '67.5%',
        width: '115%',
        marginHorizontal: scale(-20),
    },
    popularHeading: {
        color: 'white',
        fontSize: scale(19),
        fontFamily: theme.paragraphBoldFontFamily,
        paddingLeft: scale(20),
        paddingTop: scale(25),
        marginBottom: scale(-5)
    },
    scrollView: {
        width: '100%',
        paddingHorizontal: scale(20),
    },
    scrollContainer: {
        flexDirection: 'row',
    },
    popularItem: {
        color: 'white',
        width: scale(220),
        marginTop: scale(15),
        marginBottom: scale(20),
        marginRight: scale(40)
    },
    popularItemImage: {
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'cover',   
    },
    popularItemHeading: {
        color: 'white',
        marginTop: scale(10),
        fontFamily: theme.paragraphBoldFontFamily,
        fontSize: scale(13),
    },
    popularItemSubheading: {
        color: 'white',
        marginTop: scale(5),
        fontFamily: theme.paragraphFontFamily,
        fontSize: scale(10),
    }
});

export default createStyles;
