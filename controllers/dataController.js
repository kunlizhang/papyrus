const axios = require('axios');
const apiKey = '77275bc14f64499786d72ef46caab9ae';
url = 'https://newsapi.org/v2/top-headlines';

const getRecentArticles = async (req, res) => {
    const dbClient = req.app.get('dbClient');
    axios.get(url, {
        params: {
            apiKey: apiKey,
            country: 'us',
            pageSize: 100,
            page: 1
        }
    })
    .then(async (response) => {
        resp = response.data.articles;
        console.log(resp);
        for (const row of resp) {
            text = 'INSERT INTO articles (article_name, article_url, article_desc, cover_image_url) VALUES ($1, $2, $3, $4) RETURNING *';
            desc = row['description'];
            if (desc == null) desc = "";
            values = [row['title'], row['url'], desc, row['urlToImage']];
            const result = await dbClient.query(
                text, 
                values
            );
        }
        res.status(200).json({ message: 'Get recent article success' });
    })
    .catch((err) => console.log(err));
}

module.exports = { getRecentArticles };
