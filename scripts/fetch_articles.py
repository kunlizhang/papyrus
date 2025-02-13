import requests
import psycopg2
import datetime
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
CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']

class Article:
    def __init__(self, title, url, desc, urlToImage, date):
        self.title = title
        self.url = url
        self.desc = desc
        self.urlToImage = urlToImage
        self.date = date
        self.categories = []
    
    def add_category(self, category):
        self.categories.append(category)
    
    def add_to_table(self):
        values = (self.title, self.url, self.desc, self.urlToImage, self.date, self.categories)
        cur.execute("INSERT INTO articles (article_name, article_url, article_desc, cover_image_url, date, categories) VALUES (%s, %s, %s, %s, %s, %s)", values)

cnt = 0
buff = {}

for ctg in CATEGORIES:
    params = {
        'apiKey': APIKEY,
        'country': 'us',
        'pageSize': 15,
        'page': 1,
        'category': ctg
        }
    res = requests.get(URL, params=params)
    if res.status_code != 200:
        print('{res.status_code} status code')
    else:
        res = res.json()
        if res['status'] != 'ok':
            print(res['code'], res['message'])
        else:
            articles = res['articles']
            for article in articles:
                if article['title'] == REMOVED:
                    continue

                ky = article['url']
                if ky not in buff:
                    desc = article['description'] if article['description'] != None else ""
                    dt = datetime.date.today()
                    date = f"{dt.year}/{dt.month}/{dt.day}"
                    rt = Article(article['title'], article['url'], desc, article['urlToImage'], date)
                    rt.add_category(ctg)
                    buff[ky] = rt
                else:
                    buff[ky].add_category(ctg)

for _, rt in buff.items():
    rt.add_to_table()
    cnt += 1

conn.commit()
print(f'{cnt} records created successfully')
conn.close()
