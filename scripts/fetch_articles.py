import requests
import psycopg2

DBNAME='papyrus'
HOSTNAME='papyrus.ch2264qkork9.us-east-1.rds.amazonaws.com'
USERNAME='annazhou'
PASSWORD='Papyrus.2024$'
PORT=5432

conn = psycopg2.connect(dbname=DBNAME, host=HOSTNAME, user=USERNAME, password=PASSWORD, port=PORT)
cur = conn.cursor()

APIKEY = '77275bc14f64499786d72ef46caab9ae'
URL = 'https://newsapi.org/v2/top-headlines'
REMOVED = '[Removed]'

params = {
    'apiKey': APIKEY,
    'country': 'us',
    'pageSize': 100,
    'page': 1
    }
res = requests.get(URL, params=params)
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

conn.commit()
print('Records created successfully')
conn.close()
