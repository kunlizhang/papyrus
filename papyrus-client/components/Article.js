import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import WebView from 'react-native-webview';
import createStyles from '../styles/ArticleStyles';
import { handleBookmark, handleSkip, handleRemoveBookmark, isBookmarked } from '../functions/user-actions';
import { MaterialIcons } from 'react-native-vector-icons';

const Article = ({ currentArticle, handleSwipeDown }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const navigation = useNavigation();

    const [bookmarked, setBookmarked] = useState(false)

    useEffect(() => {
        isBookmarked(currentArticle)
        .then(data => {
            setBookmarked(data.isSaved);
        });

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

    const toggleBookmark = () => {
        if (bookmarked) {
            handleRemoveBookmark(currentArticle);
        } else {
            handleBookmark(currentArticle);
        }
        setBookmarked(!bookmarked);
    };

    console.log(bookmarked)

    return (
        <View style={styles.articleView}>
            <WebView 
                source={{ uri: currentArticle.article_url }} 
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
                <Text style={styles.bookmarkButton} onPress={toggleBookmark}>
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
