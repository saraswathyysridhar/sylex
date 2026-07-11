from flask import Blueprint, request, jsonify, current_app
import bcrypt
import jwt
import datetime
import re
from email_service import send_welcome_email, send_admin_notification
from db import users_collection

auth_bp = Blueprint('auth', __name__)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

def create_token(user_id, email):
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30),
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json(silent=True) or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if not EMAIL_RE.match(email):
        return jsonify({'error': 'Please enter a valid email address'}), 400

    if len(password) < 6 or len(password) > 8:
        return jsonify({'error': 'Password must be 6-8 characters'}), 400

    try:
        if users_collection.find_one({'email': email}):
            return jsonify({'error': 'An account with this email already exists'}), 409
    except Exception as exc:
        current_app.logger.error('Signup DB query failed', exc_info=exc)
        return jsonify({'error': 'Database unavailable'}), 503

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        result = users_collection.insert_one({
            'name': name,
            'email': email,
            'password': hashed,
            'created_at': datetime.datetime.utcnow().isoformat(),
            'favorites': {},
        })
    except Exception as exc:
        current_app.logger.error('Signup DB insert failed', exc_info=exc)
        return jsonify({'error': 'Database unavailable'}), 503
    user_id = str(result.inserted_id)
    member_count = users_collection.count_documents({})

    send_welcome_email(name, email)                           # welcome email to new user
    send_admin_notification(name, email, member_count)        # alert to admin inbox

    token = create_token(user_id, email)
    user = {'id': user_id, 'name': name, 'email': email}

    return jsonify({'user': user, 'token': token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        user = users_collection.find_one({'email': email})
    except Exception as exc:
        current_app.logger.error('Login DB query failed', exc_info=exc)
        return jsonify({'error': 'Database unavailable'}), 503

    if not user:
        return jsonify({'error': 'No account exists with this email'}), 404

    password_hash = user.get('password')
    if isinstance(password_hash, str):
        password_hash = password_hash.encode('utf-8')
    elif hasattr(password_hash, 'encode') and not isinstance(password_hash, (bytes, bytearray)):
        password_hash = str(password_hash).encode('utf-8')

    try:
        is_valid_password = bcrypt.checkpw(password.encode('utf-8'), password_hash)
    except Exception:
        return jsonify({'error': 'Incorrect password'}), 401

    if not is_valid_password:
        return jsonify({'error': 'Incorrect password'}), 401

    user_id = str(user['_id'])
    token = create_token(user_id, email)
    user_data = {'id': user_id, 'name': user['name'], 'email': user['email']}

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
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': {'id': str(user['_id']), 'name': user['name'], 'email': user['email']}})
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
