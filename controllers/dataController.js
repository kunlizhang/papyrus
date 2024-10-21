const axios = require('axios');
url = 'https://eventregistry.org/api/v1/article/getArticles'

const getRecentArticles = async (req, res) => {
    const dbClient = req.app.get('dbClient');
    axios.post(url, {
      action: 'getArticles',
      keyword: "Tesla Inc",
      ignoreSourceGroupUri: "paywall/paywalled_sources",
      articlesPage: 1,
      articlesCount: 100,
      articlesSortBy: "date",
      articlesSortByAsc: false,
      dataType: [
          "news",
          "pr"
      ],
      forceMaxDataTimeWindow: 31,
      resultType: "articles",
      lang: "eng",
      apiKey: "9221d1f8-dc6b-4395-8691-af0db1e5d9a5"
    })
    .then(async (response) => {
        resp = response.data.articles;
        ls = resp.results;
        console.log(resp);
        // row = ls[0];
        // console.log(row['title'], row['url'], row['body'], row['image']);
        for (const row of ls) {
            text = 'INSERT INTO articles (article_name, article_header, article_body, cover_image_url) VALUES ($1, $2, $3, $4) RETURNING *';
            values = [row['title'], row['url'], row['body'], row['image']];
            const result = await dbClient.query(
                text, 
                values
            );
        }
        res.status(200).json({ message: 'Login successful', user });
    })
    .catch((err) => console.log(err));
}

module.exports = { getRecentArticles };
