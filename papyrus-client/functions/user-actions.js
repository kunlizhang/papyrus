import Constants from "expo-constants";

const uri = 'http://' + Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':3000');
const userId = 7;

export const SwipeStatus = Object.freeze({
    LEFT: 'skip',
    RIGHT: 'save',
});

export function handleBookmark(article) {
    console.log("Bookmarking article: " + article.article_id);
}
  
export function handleRead(article) {
    console.log("Reading article: " + article.article_id);
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