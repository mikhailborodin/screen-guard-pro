# Support Requests

The `/support` page sends requests to the `support-request` Supabase Edge Function.
The function validates the request and creates a Chatwoot widget conversation in the `Screen Guard Pro` inbox.

## Deploy

```bash
supabase functions deploy support-request --project-ref rqwssmxjpphxngrncjfb --no-verify-jwt
```

## Required secrets

```bash
supabase secrets set --project-ref rqwssmxjpphxngrncjfb \
  CHATWOOT_BASE_URL="https://chatwoot.35-202-238-98.sslip.io" \
  CHATWOOT_WEBSITE_TOKEN="<Screen Guard Pro website token>" \
  SUPPORT_ALLOWED_ORIGINS="https://privacyblur.co,https://mikhailborodin.github.io,http://localhost:5173,http://127.0.0.1:5173"
```
