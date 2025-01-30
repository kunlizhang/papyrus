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
        fontFamily: theme.headlineFontFamily
    },
    profileImage: {
        width: '100%',
        height: scale(160),
        resizeMode: 'stretch',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    editImage: {
        position: 'absolute',
        right: scale(10),
        top: scale(10)
    },
    userName: {
        textAlign: 'right',
        fontSize: scale(16),
        fontFamily: theme.paragraphBoldFontFamily,
        color: 'black',
        marginTop: scale(14)
    }, 
    userEmail: {
        textAlign: 'right',
        fontSize: scale(11),
        fontFamily: theme.paragraphFontFamily,
        color: 'black',
        marginTop: scale(2)
    },
    userInterests: {
        fontSize: scale(18),
        fontFamily: theme.headlineFontFamily,
        color: 'black',
        marginTop: scale(-5)
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdown: {
        borderColor: '#ccc',
        borderRadius: 5,
        minHeight: 25,
        paddingVertical: 0,
    },
    dropdownContainerStyle: {
        width: '80%',
    },
    dropdownText: {
        fontSize: scale(11),
        fontFamily: theme.headlineFontFamily,
        color: '#333',
    },
    dropdownContent: {
        borderColor: '#ccc',
        paddingVertical: 0,
        height: scale(120)
    },
    addInterestButton: {
        fontFamily: theme.headlineFontFamily,
        color: 'black',
        backgroundColor: theme.buttonFill,
        width: '16%',
        textAlign: 'center',
        borderRadius: 7
    },
    userInterestScrollView: {
        width: '100%',
        height: scale(105)
    },
    userInterestList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: scale(5),
    },
    interestElement: {
        borderColor: theme.buttonFill,
        borderWidth: 1,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: scale(10),
        marginTop: scale(5),
        paddingLeft: scale(10),
        paddingRight: scale(10),
    },
    interestElementText: {
        paddingRight: scale(10),
        fontFamily: theme.headlineFontFamily,
        color: 'black',
    },
    restrictedContainer: {
        paddingTop: scale(8),
        marginTop: scale(8),
        borderTopColor: theme.buttonFill,
        borderTopWidth: 1,
    },
    restrictedSources: {
        fontSize: scale(18),
        fontFamily: theme.headlineFontFamily,
        color: 'black',
    },
    addSourceButton: {
        fontFamily: theme.headlineFontFamily,
        color: 'black',
        backgroundColor: theme.buttonFill,
        width: '16%',
        textAlign: 'center',
        borderRadius: 7
    },
    userSourceScrollView: {
        width: '100%',
        height: scale(105)
    },
    userSourceList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: scale(5),
    },
    sourceElement: {
        borderColor: theme.buttonFill,
        borderWidth: 1,
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: scale(10),
        marginTop: scale(5),
        paddingLeft: scale(10),
        paddingRight: scale(10),
    },
    sourceElementText: {
        paddingRight: scale(10),
        fontFamily: theme.headlineFontFamily,
        color: 'black',
    },
  });

export default createStyles;
