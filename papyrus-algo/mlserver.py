import httpx
from fastapi import FastAPI, Depends
from datetime import datetime

BACKEND_URL = "http://localhost:3000"

class ExternalDataClient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    async def get_new_articles(self):
        current_date = datetime.today().strftime("%Y-%m-%d")
        async with httpx.AsyncClient() as client:
            response = await client.request("GET", BACKEND_URL + "/data/getRecentArticles", json={"currentDate": current_date})
            return response.json()

    async def get_article_data(self, article_ids: list):
        async with httpx.AsyncClient() as client:
            response = await client.request("GET", BACKEND_URL + "/data/getArticlesData", json={"articleIds": article_ids})
            return response.json()

    async def get_user_clicked(self, user_id: str):
        async with httpx.AsyncClient() as client:
            response = await client.request("GET", BACKEND_URL + "/users/getClickedArticles", json={"user_id": user_id})
            return response.json()

app = FastAPI()

external_data_client = ExternalDataClient(BACKEND_URL)

def get_external_data_client():
    return external_data_client

@app.get("/getRecommendations")
async def get_recommendations(
    user_id: str, 
    api_client: ExternalDataClient = Depends(get_external_data_client)):
    """
    ML server gets all the new articles for the day
    ML server gets the data for a user
    ML server runs model for that user for all the new data
    ML server returns ordered list of articles
    """
    new_articles = await api_client.get_new_articles()
    user_clicked_on = list(map(
        lambda x: x["article_id"],
        await api_client.get_user_clicked(user_id)
    ))

    # Get the data for the clicked-on articles
    clicked_on_data = await api_client.get_article_data(user_clicked_on)


    return clicked_on_data