# نیرا شاپ — بوتیک پوشاک زنانه

Persian RTL women’s fashion boutique + admin.

```bash
npm install
# Optional but recommended for a stable local admin login:
# export ADMIN_PASSWORD='your-strong-password'
# export ADMIN_SESSION_SECRET='long-random-string'
npm run dev
```

Open http://127.0.0.1:3000 — admin at `/admin`.

## Admin credentials

- **Published app:** set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in Cursor Secrets, then republish.
- **Local without env:** a one-time password is written to `.data/admin-password` (gitignored).
- Change the password anytime from `/admin/settings`.
