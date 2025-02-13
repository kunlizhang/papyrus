import json
import random

CATEGORIES = "categories"
NULL_CATEGORY = "null"
ARTICLE_ID = "article_id"
ALPHA = 20

class AltModel:
    def __init__(self):
        pass

    def sort_recommendations(self, user_clicked: list, new_articles: list):
        """
        Sort the new articles based on the user's data.
        """
        category_dict = {}

        for article in user_clicked:
            if CATEGORIES in article and article[CATEGORIES]:
                for category in article[CATEGORIES]:
                    category_dict[category] = category_dict.get(category, 0) + 1
            else:
                category_dict[NULL_CATEGORY] = category_dict.get(NULL_CATEGORY, 0) + 1

        total = sum(category_dict.values())

        for key, value in category_dict.items():
            category_dict[key] = value / total * 100

        articles_score = {}

        for article in new_articles:
            score = 0
            if CATEGORIES in article and article[CATEGORIES]:
                for category in article[CATEGORIES]:
                    score += category_dict.get(category, 0)
                score /= len(article[CATEGORIES])
            else:
                score += category_dict.get(NULL_CATEGORY, 0)
            
            score += random.randrange(0, ALPHA)
            
            articles_score[article[ARTICLE_ID]] = score
        
        return sorted(articles_score, key=articles_score.get, reverse=True)
        




