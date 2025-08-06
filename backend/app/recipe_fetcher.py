import requests
from fastapi import HTTPException
import logging

logger = logging.getLogger("uvicorn.error")


def get_mealdb_recipes():
    all_meals = []
    letters = "abcdefghijklmnopqrstuvwxyz"

    for letter in letters:
        try:
            response = requests.get(
                f"https://www.themealdb.com/api/json/v1/1/search.php?f={letter}",
                timeout=5,
            )
            response.raise_for_status()
            data = response.json()
            meals = data.get("meals", [])
            if meals:
                all_meals.extend(meals)
        except requests.exceptions.Timeout:
            logger.error(f"Timeout while fetching recipes for letter '{letter}'")
            raise HTTPException(status_code=504, detail="External API timed out")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching recipes for letter '{letter}': {e}")
            raise HTTPException(status_code=503, detail="Error fetching recipes")

    return [meal["strMeal"] for meal in all_meals if "strMeal" in meal]
