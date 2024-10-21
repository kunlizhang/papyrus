const axios = require('axios');
url = 'https://eventregistry.org/api/v1/article/getArticles'

const getRecentArticles = async (req, res) => {
    reqBody = 
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
      apiKey: "9221d1f8-dc6b-4395-8691-af0db1e5d9a5"
    })
    .then((response) => console.log(response['data']['articles']))
    .catch((err) => console.log(err));
}

module.exports = { getRecentArticles };
