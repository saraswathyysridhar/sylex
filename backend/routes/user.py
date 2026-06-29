from flask import Blueprint, request, jsonify, current_app
import jwt
from routes.auth import users_store

user_bp = Blueprint('user', __name__)

def get_current_user():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return users_store.get(payload.get('email'))
    except jwt.InvalidTokenError:
        return None

@user_bp.route('/favorites', methods=['GET'])
def get_favorites():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({'favorites': user.get('favorites', {})})

@user_bp.route('/favorites', methods=['POST'])
def toggle_favorite():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    item = data.get('item')
    item_type = data.get('type')

    if not item or not item_type:
        return jsonify({'error': 'item and type are required'}), 400

    key = f"{item_type}_{item['id']}"
    favs = user.get('favorites', {})

    if key in favs:
        del favs[key]
        action = 'removed'
    else:
        favs[key] = {**item, 'type': item_type}
        action = 'added'

    user['favorites'] = favs
    return jsonify({'action': action, 'favorites': favs})

@user_bp.route('/profile', methods=['GET'])
def get_profile():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    return jsonify({
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'created_at': user.get('created_at'),
        'favorites_count': len(user.get('favorites', {})),
    })
