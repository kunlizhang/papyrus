import Constants from "expo-constants";

const uri = 'http://' + Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':3000');
const userId = 7;

export const SwipeStatus = Object.freeze({
    LEFT: 'skip',
    RIGHT: 'save',
});

export function isBookmarked(article) {

    const articleId = article.article_id;
    const url = uri + `/articles/isSaved?user_id=${encodeURIComponent(userId)}`;

    console.log("Checking bookmarked status of article: " + articleId);

    return fetch(url, {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ article_id: articleId })
        })
        .then(response => response.json())
        .then(data => {return data})
        .catch(error => console.error('Error:', error));
}

export function handleBookmark(article) {

    const articleId = article.article_id;
    const url = uri + `/articles/save?user_id=${encodeURIComponent(userId)}`;

    console.log("Bookmarking article: " + articleId);

    return fetch(url, {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ article_id: articleId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Message:', data.message); 
        })
        .catch(error => console.error('Error:', error));
}

export function handleRemoveBookmark(article) {

    const articleId = article.article_id;
    const url = uri + `/articles/removeSaved?user_id=${encodeURIComponent(userId)}`;

    console.log("Removing bookmark on article: " + articleId);

    return fetch(url, {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ article_id: articleId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Message:', data.message); 
        })
        .catch(error => console.error('Error:', error));
}
  
export function handleRead(article) {

    const articleId = article.article_id;
    const url = uri + `/articles/click?user_id=${encodeURIComponent(userId)}`;

    console.log("Reading article: " + articleId);

    return fetch(url, {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ article_id: articleId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Message:', data.message); 
        })
        .catch(error => console.error('Error:', error));
}

export function handleSkip(article) {
    console.log("Skipping article: " + article.article_id);
}

export function addInterest(interest) {
    console.log("Adding interest: " + interest);
}

export function deleteInterest(interest) {
    console.log("Deleting interest: " + interest);
}

export function addRestrictedSource(interest) {
    console.log("Adding source: " + interest);
}

export function getRecommendedArticles() {
    const url = uri + `/data/getRecommendations?user_id=${encodeURIComponent(userId)}`;
    
    return fetch(url, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Error fetching recommended articles:", error);
            return [];
        });
}

export async function getRecommendedArticlesAsJson() {
    try {
        const articleIds = await getRecommendedArticles();

        if (!Array.isArray(articleIds) || articleIds.length === 0) {
            console.error("No article IDs received.");
            return [];
        }

        const url = uri + `/data/getArticlesData`;

        return fetch(url, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ articleIds }),
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Error fetching recommended articles:", error);
                return [];
            });
    } catch (error) {
        console.error("Error in getRecommendedArticlesAsJson:", error);
    }
}

export function getSavedArticles() {
    const url = uri + `/users/getSavedArticles?user_id=${encodeURIComponent(userId)}`;
    
    return fetch(url, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            const formattedArray = data.map(obj => obj.article_id);
            return formattedArray;
        })
        .catch(error => {
            console.error("Error fetching recommended articles:", error);
            return [];
        });
}

export async function getSavedArticlesAsJson() {
    try {
        const articleIds = await getSavedArticles();

        if (!Array.isArray(articleIds) || articleIds.length === 0) {
            console.error("No article IDs received.");
            return [];
        }

        const url = uri + `/data/getArticlesData`;

        return fetch(url, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ articleIds }),
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error("Error fetching saved articles:", error);
                return [];
            });
    } catch (error) {
        console.error("Error in getSavedArticlesAsJson:", error);
    }
}