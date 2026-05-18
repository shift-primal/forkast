import httpx
import re
import xml.etree.ElementTree as ET
from config import (
    USER_AGENT,
    STORE_BASE,
    STORE_SITEMAP_PATH,
    STORE_CATEGORY_PATH,
    STORE_CATEGORY_DATA_PATH,
    STORE_CHAIN_ID,
    STORE_ID,
    STORE_HEADERS,
    API_BASE,
    API_RECIPE_PATH,
    API_HEADERS,
    RECIPE_UUID_REGEX,
)

CATEGORY_UUID_RE = re.compile(RECIPE_UUID_REGEX)


def get_category_slugs() -> list[str]:
    r = httpx.get(f"{STORE_BASE}/{STORE_SITEMAP_PATH}")
    root = ET.fromstring(r.content)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    slugs = []

    for loc in root.findall(".//sm:loc", ns):
        if loc.text and f"/{STORE_CATEGORY_PATH}" in loc.text:
            slug = loc.text.rstrip("/").split(f"/{STORE_CATEGORY_PATH}/")[-1]
            if "/" not in slug:
                slugs.append(slug)

    return slugs


def get_category_id(slug: str) -> str | None:
    r = httpx.get(
        f"{STORE_BASE}/{STORE_CATEGORY_PATH}/{slug}",
        headers=STORE_HEADERS,
        follow_redirects=True,
        timeout=30,
    )

    match = CATEGORY_UUID_RE.search(r.text)

    return match.group(1) if match else None


def get_recipe_ids(category_id: str, limit: int = 0) -> list[str]:
    batch = 50
    from_idx = 0

    ids = []

    while True:
        r = httpx.get(
            f"{STORE_BASE}/{STORE_CATEGORY_DATA_PATH}",
            params={
                "recipeCategoryId": category_id,
                "from": from_idx,
                "to": from_idx + batch,
            },
            headers={"User-Agent": USER_AGENT},
            timeout=30,
        )

        r.raise_for_status()
        data = r.json()

        recipes = data.get("recipes", [])
        ids.extend(rec["recipeId"] for rec in recipes)

        if limit and len(ids) >= limit:
            break

        if from_idx + batch >= data["total"]:
            break
        from_idx += batch

    return ids[:limit] if limit else ids


def fetch_recipe(recipe_id: str) -> dict:
    url = f"{API_BASE}/{API_RECIPE_PATH}/{STORE_CHAIN_ID}/{recipe_id}"
    r = httpx.get(
        url,
        params={
            "store_id": STORE_ID,
            "full_response": "true",
            "fieldset": "maximal",
        },
        headers=API_HEADERS,
        timeout=15,
    )
    r.raise_for_status()
    return r.json()["_source"]
