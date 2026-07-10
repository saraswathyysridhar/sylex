import threading
import time
from email_service import send_visitor_digest

DIGEST_INTERVAL_SECONDS = 7 * 24 * 60 * 60  # 7 days
DIGEST_INTERVAL_DAYS = 7

_lock = threading.Lock()
_visitors = set()


def record_visit(visitor_id: str) -> None:
    if not visitor_id:
        return
    with _lock:
        _visitors.add(visitor_id)


def _digest_loop() -> None:
    while True:
        time.sleep(DIGEST_INTERVAL_SECONDS)
        with _lock:
            count = len(_visitors)
            _visitors.clear()
        send_visitor_digest(count, DIGEST_INTERVAL_DAYS)


def start_visit_tracker() -> None:
    """Starts the background thread that emails a traffic digest every 7 days."""
    t = threading.Thread(target=_digest_loop, daemon=True)
    t.start()
