import logging
import os
from urllib.parse import urlparse
from pymongo import MongoClient

logger = logging.getLogger(__name__)

def get_mongo_uri():
    for key in ('MONGO_URI', 'MONGODB_URI', 'DATABASE_URL'):
        uri = os.getenv(key)
        if not uri:
            continue
        if key == 'DATABASE_URL' and not uri.startswith('mongodb'):
            continue
        return uri
    return 'mongodb://localhost:27017/sylex'

MONGO_URI = get_mongo_uri()

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
parsed = urlparse(MONGO_URI)
db_name = parsed.path.lstrip('/') or 'sylex'

# If the URI does not explicitly include a database name, use the fallback.
db = client[db_name]

try:
    client.admin.command('ping')
except Exception as exc:
    logger.exception('MongoDB connection failed')

users_collection = db['users']
visitors_collection = db['visitors']
