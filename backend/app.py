from flask import Flask, jsonify
from flask_cors import CORS
from routes.auth import auth_bp
from routes.user import user_bp
from routes.visits import visits_bp
from visit_tracker import start_visit_tracker
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'sylex-secret-key-change-in-production')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/sylex')

CORS(app, resources={r'/api/*': {'origins': '*'}})

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(visits_bp, url_prefix='/api/visits')

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Sylex API running'})

# Starts on import, so it runs both under `python app.py` and under gunicorn
# (which imports this module directly and never hits the __main__ block below).
# Skipped only in the Werkzeug reloader's watcher process, which re-execs this
# script as a subprocess to do the actual serving.
_is_reloader_watcher = __name__ == '__main__' and os.environ.get('WERKZEUG_RUN_MAIN') is None
if not _is_reloader_watcher:
    start_visit_tracker()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
