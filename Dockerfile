FROM python:3

WORKDIR /

RUN pip install requests
RUN pip install psycopg2

COPY scripts/* ./

CMD ["python", "fetch_articles.py"]