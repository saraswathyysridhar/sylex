from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from routes.user import user_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'sylex-secret-key-change-in-production')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/sylex')

CORS(app, resources={r'/api/*': {'origins': '*'}})

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/user')

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Sylex API running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
