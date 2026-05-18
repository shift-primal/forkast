from dotenv import load_dotenv
import os

load_dotenv()

# Scraper

USER_AGENT = os.getenv("USER_AGENT", "")

STORE_BASE = os.getenv("STORE_BASE", "")
STORE_SITEMAP_PATH = os.getenv("STORE_SITEMAP_PATH", "")
STORE_CATEGORY_PATH = os.getenv("STORE_CATEGORY_PATH", "")
STORE_CATEGORY_DATA_PATH = os.getenv("STORE_CATEGORY_DATA_PATH", "")
STORE_CHAIN_ID = os.getenv("STORE_CHAIN_ID", "")
STORE_ID = os.getenv("STORE_ID", "")
STORE_HEADERS = {"User-Agent": USER_AGENT}

API_BASE = os.getenv("API_BASE", "")
API_RECIPE_PATH = os.getenv("API_RECIPE_PATH", "")
API_CHAIN_HEADER = os.getenv("API_CHAIN_HEADER", "")
API_HEADERS = {
    API_CHAIN_HEADER: STORE_CHAIN_ID,
    "Origin": STORE_BASE,
    "Referer": f"{STORE_BASE}/",
    "User-Agent": USER_AGENT,
}

RECIPE_UUID_REGEX = os.getenv("RECIPE_UUID_REGEX", "")

# Db

DATABASE_URL = os.getenv("DATABASE_URL", "")
