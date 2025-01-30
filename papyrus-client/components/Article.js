import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import WebView from 'react-native-webview';
import createStyles from '../styles/ArticleStyles';
import { handleBookmark, handleSkip } from '../functions/user-actions';
import { MaterialIcons } from 'react-native-vector-icons';

const Article = ({ currentArticle, handleSwipeDown }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const navigation = useNavigation();

    // TODO: make global
    const [bookmarked, setBookmarked] = useState(false);

    React.useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            tabBarStyle: {
                display: 'none',
            },
        });

        return () => {
            navigation.setOptions({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.tabBarColor,
                    borderTopWidth: 0,
                    height: scale(65),
                },
            });
        };
    }, [navigation]);
    
    return (
        <View style={styles.articleView}>
            <WebView 
                source={{ uri: currentArticle.source }} 
                style={[styles.webView, { overflowX: 'hidden' }]} 
                scalesPageToFit={false} 
                scrollEnabled={true}
            />
            <View style={styles.navBar}>
                <Text style={styles.buttonContainer} onPress={handleSwipeDown}>⌃</Text>
                <Text style={styles.skipButton} onPress={() => {
                    handleSkip(currentArticle); 
                    handleSwipeDown();
                }}>
                    <MaterialIcons name="close" size={theme.iconSize} color={theme.tabBarActiveTintColor} />
                </Text>
                <Text style={styles.bookmarkButton} onPress={() => {
                    handleBookmark(currentArticle); 
                    setBookmarked(!bookmarked);
                }}>
                    {
                        bookmarked ? 
                        <MaterialIcons name="bookmark" size={theme.iconSize} color={theme.tabBarActiveTintColor} /> : 
                        <MaterialIcons name="bookmark-border" size={theme.iconSize} color={theme.tabBarActiveTintColor} />
                    }
                </Text>
            </View>
        </View>
    );
}

export default Article;
