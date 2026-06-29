from flask import Blueprint, request, jsonify, current_app
import bcrypt
import jwt
import datetime
import os
from email_service import send_welcome_email, send_admin_notification

auth_bp = Blueprint('auth', __name__)

# In-memory store for demo (replace with MongoDB in production)
users_store = {}

def create_token(user_id, email):
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30),
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    if email in users_store:
        return jsonify({'error': 'Email already registered'}), 409

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_id = str(len(users_store) + 1)

    users_store[email] = {
        'id': user_id,
        'name': name,
        'email': email,
        'password': hashed,
        'created_at': datetime.datetime.utcnow().isoformat(),
        'favorites': {},
    }

    token = create_token(user_id, email)
    user = {'id': user_id, 'name': name, 'email': email}

    send_welcome_email(name, email)                          # welcome email to new user
    send_admin_notification(name, email, len(users_store))  # alert to admin inbox

    return jsonify({'user': user, 'token': token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = users_store.get(email)
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = create_token(user['id'], email)
    user_data = {'id': user['id'], 'name': user['name'], 'email': user['email']}

    return jsonify({'user': user_data, 'token': token}), 200

@auth_bp.route('/verify', methods=['GET'])
def verify():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No token provided'}), 401

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        email = payload.get('email')
        user = users_store.get(email)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': {'id': user['id'], 'name': user['name'], 'email': user['email']}})
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
