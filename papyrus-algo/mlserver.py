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

    async def get_user_data(self, user_id: str):
        pass

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
    return new_articles