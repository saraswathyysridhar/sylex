import os
from pymongo import MongoClient

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/sylex')

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
db = client.get_default_database()

users_collection = db['users']
visitors_collection = db['visitors']
