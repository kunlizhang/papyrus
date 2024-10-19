const { EventRegistry, QueryArticlesIter } = require("eventregistry");

// Initialize EventRegistry with your API key
const er = new EventRegistry({ apiKey: "049c7479-755f-4a0e-b321-232201d07284" });

async function fetchArticles() {
    try {
        // Get concept URI for George Clooney
        const conceptUri = await er.getConceptUri("George Clooney");
        
        // Create a query for articles related to George Clooney
        const q = new QueryArticlesIter(er, { conceptUri: conceptUri, sortBy: "date" });
        
        // Execute the query and iterate over the results
        q.execQuery((items) => {
            for (const item of items) {
                console.info(item);
            }
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
    }
}

fetchArticles();
