from flask import Blueprint, request, jsonify
try:
    from backend.visit_tracker import record_visit
except ImportError:
    from visit_tracker import record_visit

visits_bp = Blueprint('visits', __name__)


@visits_bp.route('/track', methods=['POST'])
def track():
    data = request.get_json(silent=True) or {}
    visitor_id = data.get('visitorId', '').strip()
    record_visit(visitor_id)
    return jsonify({'status': 'ok'})
