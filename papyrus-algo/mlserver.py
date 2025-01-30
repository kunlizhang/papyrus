import httpx
from fastapi import FastAPI, Depends

BACKEND_URL = "https://example.com"

class ExternalDataClient:
    def __init__(self, base_url: str):
        self.base_url = base_url

    async def get_new_articles(self):
        pass

    async def get_user_data(self, user_id: str):
        pass

app = FastAPI()

external_data_client = ExternalDataClient(BACKEND_URL)

def get_external_data_client():
    return external_data_client

@app.get("/getRecommendations")
def get_recommendations(
    user_id: str, 
    api_client: ExternalDataClient = Depends(get_external_data_client)):
    """
    ML server gets all the new articles for the day
    ML server gets the data for a user
    ML server runs model for that user for all the new data
    ML server returns ordered list of articles
    """
    return {"message": "Hello World"}