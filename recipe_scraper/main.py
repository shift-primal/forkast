import time

from sqlmodel import Session
from db import create_db, engine, save_all
from scraper import get_category_slugs, get_category_id, get_recipe_ids, fetch_recipe

LIMIT = 1
SLEEP_TIME = 0.05


def be_kind(sleep_time: float) -> None:
    time.sleep(sleep_time)


def run() -> None:

    create_db()

    cat_slugs = get_category_slugs()
    cat_ids = []
    recipe_ids = []

    for slug in cat_slugs[:LIMIT] if LIMIT else cat_slugs:
        category_id = get_category_id(slug)

        if category_id is not None:
            cat_ids.append(category_id)

        be_kind(SLEEP_TIME)

    for cat_id in cat_ids[:LIMIT] if LIMIT else cat_ids:
        recipe_id = get_recipe_ids(cat_id, LIMIT)

        if recipe_id:
            recipe_ids.extend(recipe_id)

        be_kind(SLEEP_TIME)

    recipe_ids = list(set(recipe_ids))

    with Session(engine) as session:
        for recipe_id in recipe_ids[:LIMIT] if LIMIT else recipe_ids:
            recipe = fetch_recipe(recipe_id)
            save_all(session, recipe)
            session.commit()

            be_kind(SLEEP_TIME)


if __name__ == "__main__":
    run()
