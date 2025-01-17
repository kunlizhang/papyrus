import requests
import psycopg2
import os

DBNAME=os.getenv('DBNAME')
HOSTNAME=os.getenv('HOSTNAME')
USERNAME=os.getenv('USERNAME')
PASSWORD=os.getenv('PASSWORD')
PORT=os.getenv('PORT')
APIKEY=os.getenv('APIKEY')

conn = psycopg2.connect(dbname=DBNAME, host=HOSTNAME, user=USERNAME, password=PASSWORD, port=PORT)
cur = conn.cursor()

URL = 'https://newsapi.org/v2/top-headlines'
REMOVED = '[Removed]'

params = {
    'apiKey': APIKEY,
    'country': 'us',
    'pageSize': 100,
    'page': 1
    }
res = requests.get(URL, params=params)
cnt = 0
if res.status_code != 200:
    print('{rs.status_code} status code')
else:
    res = res.json()
    if res['status'] != 'ok':
        print(res['code'], res['message'])
    else:
        articles = res['articles']
        for article in articles:
            if article['title'] == REMOVED:
                continue
            desc = article['description'] if article['description'] != None else ""
            values = (article['title'], article['url'], desc, article['urlToImage'])
            cur.execute("INSERT INTO articles (article_name, article_url, article_desc, cover_image_url) VALUES (%s, %s, %s, %s)", values)
            cnt += 1

conn.commit()
print(f'{cnt} records created successfully')
conn.close()
