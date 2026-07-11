import threading
import time
from email_service import send_visitor_digest
from db import visitors_collection

DIGEST_INTERVAL_SECONDS = 7 * 24 * 60 * 60  # 7 days
DIGEST_INTERVAL_DAYS = 7


def record_visit(visitor_id: str) -> None:
    if not visitor_id:
        return
    visitors_collection.update_one({'_id': visitor_id}, {'$set': {'_id': visitor_id}}, upsert=True)


def _digest_loop() -> None:
    while True:
        time.sleep(DIGEST_INTERVAL_SECONDS)
        count = visitors_collection.count_documents({})
        visitors_collection.delete_many({})
        send_visitor_digest(count, DIGEST_INTERVAL_DAYS)


def start_visit_tracker() -> None:
    """Starts the background thread that emails a traffic digest every 7 days."""
    t = threading.Thread(target=_digest_loop, daemon=True)
    t.start()
