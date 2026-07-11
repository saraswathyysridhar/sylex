import os
from urllib.parse import urlparse
from pymongo import MongoClient

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/sylex')

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
parsed = urlparse(MONGO_URI)
db_name = parsed.path.lstrip('/') or 'sylex'

# If the URI does not explicitly include a database name, use the fallback.
db = client[db_name]

users_collection = db['users']
visitors_collection = db['visitors']
