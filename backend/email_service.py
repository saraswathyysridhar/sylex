import json
import threading
import os
import urllib.request
import urllib.error

# Render's free tier blocks outbound SMTP (port 587), so email is sent via
# Brevo's HTTPS transactional API instead of smtplib — see brevo.com.
BREVO_API_KEY = os.getenv('BREVO_API_KEY', '')
BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

FROM_NAME  = os.getenv('FROM_NAME',  'Sylex')
FROM_EMAIL = os.getenv('FROM_EMAIL', 'sylexwebadmin@gmail.com')
APP_URL    = os.getenv('APP_URL',    'http://localhost:5173')


def _send_via_brevo(to_email: str, subject: str, html: str, plain: str, label: str = 'Email') -> None:
    """Blocking send — always called from a background thread."""
    if not BREVO_API_KEY:
        print(f'[email] BREVO_API_KEY not configured — skipping {label.lower()} to {to_email}')
        return

    payload = json.dumps({
        'sender': {'name': FROM_NAME, 'email': FROM_EMAIL},
        'to': [{'email': to_email}],
        'subject': subject,
        'htmlContent': html,
        'textContent': plain,
    }).encode('utf-8')

    req = urllib.request.Request(BREVO_API_URL, data=payload, method='POST', headers={
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    })

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            resp.read()
        print(f'[email] {label} sent -> {to_email}')
    except urllib.error.HTTPError as exc:
        body = exc.read().decode('utf-8', errors='replace')
        print(f'[email] {label} failed for {to_email}: {exc.code} {body}')
    except Exception as exc:
        print(f'[email] {label} failed for {to_email}: {exc}')


def _build_welcome_html(name: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to Sylex</title>
</head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'Georgia',serif;">

  <!-- wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- header -->
        <tr>
          <td style="background:#0C0A08;border-radius:16px 16px 0 0;padding:40px 48px 32px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C49A6C;font-family:'Georgia',serif;">
              WELCOME TO
            </p>
            <h1 style="margin:0;font-size:52px;font-weight:400;letter-spacing:-0.04em;color:#FDFAF6;font-family:'Georgia',serif;font-style:italic;">
              Sylex
            </h1>
            <p style="margin:14px 0 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,240,220,0.35);">
              Films &middot; Recipes &middot; Games &middot; Books &middot; Music &middot; Drinks
            </p>
          </td>
        </tr>

        <!-- gold divider line -->
        <tr>
          <td style="background:#0C0A08;padding:0 48px;">
            <div style="height:1px;background:linear-gradient(90deg,transparent,#C49A6C,transparent);"></div>
          </td>
        </tr>

        <!-- body -->
        <tr>
          <td style="background:#0C0A08;border-radius:0 0 16px 16px;padding:36px 48px 44px;">

            <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#C49A6C;">
              Hey {name},
            </p>
            <p style="margin:0 0 24px;font-size:26px;line-height:1.3;color:#FDFAF6;font-weight:400;letter-spacing:-0.01em;">
              Your account is ready.<br/>
              <em style="color:#C49A6C;">Everything you love,<br/>now in one place.</em>
            </p>

            <p style="margin:0 0 28px;font-size:15px;line-height:1.75;color:rgba(255,240,220,0.55);">
              Sylex is a mood-first discovery platform. Tell us how you feel and
              we'll surface the perfect film, recipe, game, book, playlist, or drink
              — curated for your exact moment, every time.
            </p>

            <!-- feature grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="50%" style="padding:0 6px 10px 0;vertical-align:top;">
                  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;">
                    <p style="margin:0 0 4px;font-size:18px;">🎬</p>
                    <p style="margin:0;font-size:13px;font-weight:600;color:#FDFAF6;">Films &amp; Shows</p>
                    <p style="margin:4px 0 0;font-size:11px;color:rgba(255,240,220,0.35);">1M+ titles, every mood</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 10px 6px;vertical-align:top;">
                  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;">
                    <p style="margin:0 0 4px;font-size:18px;">🍝</p>
                    <p style="margin:0;font-size:13px;font-weight:600;color:#FDFAF6;">Recipes &amp; Drinks</p>
                    <p style="margin:4px 0 0;font-size:11px;color:rgba(255,240,220,0.35);">50K+ dishes &amp; cocktails</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding:0 6px 0 0;vertical-align:top;">
                  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;">
                    <p style="margin:0 0 4px;font-size:18px;">🎮</p>
                    <p style="margin:0;font-size:13px;font-weight:600;color:#FDFAF6;">Games &amp; Books</p>
                    <p style="margin:4px 0 0;font-size:11px;color:rgba(255,240,220,0.35);">500K+ games · 40M books</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 0 6px;vertical-align:top;">
                  <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;">
                    <p style="margin:0 0 4px;font-size:18px;">🎵</p>
                    <p style="margin:0;font-size:13px;font-weight:600;color:#FDFAF6;">Music &amp; Activities</p>
                    <p style="margin:4px 0 0;font-size:11px;color:rgba(255,240,220,0.35);">Playlists + things to do</p>
                  </div>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
              <tr>
                <td style="border-radius:100px;background:#C49A6C;">
                  <a href="{APP_URL}" style="display:inline-block;padding:14px 40px;font-size:14px;font-weight:700;color:#1A0E08;text-decoration:none;letter-spacing:0.04em;font-family:'Georgia',serif;">
                    Start Exploring &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 10px;font-size:12px;line-height:1.7;color:rgba(255,240,220,0.45);text-align:center;">
              Don't see this in your inbox next time? Check your Spam or Promotions folder
              and mark us as "Not spam" so future emails land where you'll see them.
            </p>

            <p style="margin:0;font-size:13px;line-height:1.7;color:rgba(255,240,220,0.35);text-align:center;">
              You're receiving this because you created an account at Sylex.<br/>
              Questions? Reply to this email anytime.
            </p>
          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td style="padding:24px 48px 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:rgba(60,50,40,0.45);letter-spacing:0.06em;">
              &copy; 2026 Sylex &nbsp;&middot;&nbsp; Discover your mood
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>"""


def _send(name: str, to_email: str) -> None:
    subject = f'Welcome to Sylex, {name} ✨'
    plain = (
        f"Hey {name},\n\n"
        "Welcome to Sylex — your mood-first discovery platform.\n\n"
        "Explore films, recipes, games, books, music, and drinks "
        "curated for your exact moment.\n\n"
        f"Get started: {APP_URL}\n\n"
        "(Don't see this next time? Check your Spam or Promotions folder and mark us as \"Not spam\".)\n\n"
        "— The Sylex Team"
    )
    _send_via_brevo(to_email, subject, _build_welcome_html(name), plain, label='Welcome email')


def send_welcome_email(name: str, email: str) -> None:
    """Fire-and-forget: spawns a daemon thread so signup response is instant."""
    t = threading.Thread(target=_send, args=(name, email), daemon=True)
    t.start()


# ── Admin notification ────────────────────────────────────────────────────────

ADMIN_EMAIL = os.getenv('FROM_EMAIL') or FROM_EMAIL  # same inbox as the sender

def _send_admin(new_name: str, new_email: str, count: int) -> None:
    subject = f'🎉 New Sylex signup #{count} — {new_name}'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Signup</title></head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:32px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <tr>
          <td style="background:#0C0A08;border-radius:14px 14px 0 0;padding:28px 36px 22px;text-align:center;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#C49A6C;">Sylex Admin</p>
            <h1 style="margin:0;font-size:36px;font-weight:400;color:#FDFAF6;letter-spacing:-0.03em;font-style:italic;">New Member</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#0C0A08;border-radius:0 0 14px 14px;padding:24px 36px 32px;">
            <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:rgba(255,240,220,0.65);">
              A new user just joined Sylex:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px 10px 0 0;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#C49A6C;">Name</p>
                  <p style="margin:4px 0 0;font-size:16px;color:#FDFAF6;font-weight:600;">{new_name}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 10px 10px;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#C49A6C;">Email</p>
                  <p style="margin:4px 0 0;font-size:15px;color:#FDFAF6;">{new_email}</p>
                </td>
              </tr>
            </table>
            <div style="text-align:center;padding:16px;background:rgba(196,154,108,0.1);border:1px solid rgba(196,154,108,0.25);border-radius:10px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#C49A6C;">Total Members</p>
              <p style="margin:6px 0 0;font-size:42px;font-weight:400;color:#C49A6C;letter-spacing:-0.04em;font-style:italic;">{count}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 0 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:rgba(60,50,40,0.4);">&copy; 2026 Sylex &nbsp;&middot;&nbsp; Admin notification</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    plain = f"New Sylex signup #{count}\n\nName: {new_name}\nEmail: {new_email}\nTotal members: {count}"

    _send_via_brevo(ADMIN_EMAIL, subject, html, plain, label='Admin notification')


def send_admin_notification(new_name: str, new_email: str, count: int) -> None:
    """Fire-and-forget admin alert when a new user registers."""
    t = threading.Thread(target=_send_admin, args=(new_name, new_email, count), daemon=True)
    t.start()


# ── Periodic visitor digest ─────────────────────────────────────────────────

VISIT_DIGEST_EMAIL = 'sylexwebadmin@gmail.com'

def _send_visitor_digest(count: int, days: int) -> None:
    subject = f'📈 Sylex traffic digest — {count} visitor{"s" if count != 1 else ""} in the last {days} days'

    html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Visitor Digest</title></head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:32px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <tr>
          <td style="background:#0C0A08;border-radius:14px 14px 0 0;padding:28px 36px 22px;text-align:center;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#C49A6C;">Sylex Admin</p>
            <h1 style="margin:0;font-size:36px;font-weight:400;color:#FDFAF6;letter-spacing:-0.03em;font-style:italic;">Traffic Digest</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#0C0A08;border-radius:0 0 14px 14px;padding:24px 36px 32px;">
            <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:rgba(255,240,220,0.65);">
              Here's how Sylex did over the last {days} days:
            </p>
            <div style="text-align:center;padding:20px;background:rgba(196,154,108,0.1);border:1px solid rgba(196,154,108,0.25);border-radius:10px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#C49A6C;">Unique Visitors</p>
              <p style="margin:6px 0 0;font-size:42px;font-weight:400;color:#C49A6C;letter-spacing:-0.04em;font-style:italic;">{count}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 0 0;text-align:center;">
            <p style="margin:0;font-size:11px;color:rgba(60,50,40,0.4);">&copy; 2026 Sylex &nbsp;&middot;&nbsp; Admin notification</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

    plain = f"Sylex traffic digest\n\n{count} unique visitor(s) over the last {days} days."

    _send_via_brevo(VISIT_DIGEST_EMAIL, subject, html, plain, label='Visitor digest')


def send_visitor_digest(count: int, days: int = 7) -> None:
    """Fire-and-forget periodic traffic summary."""
    t = threading.Thread(target=_send_visitor_digest, args=(count, days), daemon=True)
    t.start()
