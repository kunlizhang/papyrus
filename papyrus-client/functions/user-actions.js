export const SwipeStatus = Object.freeze({
    LEFT: 'skip',
    RIGHT: 'save',
});

export function handleBookmark(article) {
    console.log("Bookmarking article: " + article.id);
}
  
export function handleRead(article) {
    console.log("Reading article: " + article.id);
}

export function handleSkip(article) {
    console.log("Skipping article: " + article.id);
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