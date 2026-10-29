# PostHog Founder 5 Metrics — Setup & Runbook

This repository (`privacyblur.co` + Supabase Edge Functions) implements the web attribution, PostHog reverse-proxy ingestion, Stripe billing webhooks, and automated dashboard provisioning for Screen Privacy Blur's 5 core SaaS metrics.

## 1. Architecture Overview

1. **First-party web telemetry (`src/data/webTelemetry.mjs` -> `supabase/functions/web-telemetry`)**
   - Works identically across static pre-rendered HTML pages (`/`, `/welcome/`, `/uninstall/`, localized routes, SEO pages) and React routes (`/paywall/`, `/payment-success/`, `/payment-cancelled/`).
   - Stores a 30-day first-touch attribution record (`pb_ft`: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, ad click ID type `gclid`/`msclkid`/`fbclid`, external referrer host, landing path) in first-party storage/cookie.
   - Internal extension flows (`utm_source=extension_install` and `utm_source=extension_uninstall`) never overwrite prior marketing attribution.
   - When the extension opens `/welcome/?install_id=<uuid>`, `/paywall/?install_id=<uuid>&feature=<feature>`, or `/uninstall/?install_id=<uuid>`, `web-telemetry` aliases the pre-install `visitor_id` to `install_id` (`$create_alias`) and sets `$set_once` initial UTM properties on the PostHog person profile while stripping IP/GeoIP (`$ip: null`, `$geoip_disable: true`).

2. **Checkout metadata forwarding (`src/lib/billing.ts` -> `supabase/functions/create-checkout-session`)**
   - Preserves `feature = "smart-auto-blur"` and `client_reference_id = extensionId` so `subscription-status` entitlement verification remains backwards-compatible.
   - Attaches validated `installId`, `paywallFeature` (`smart-auto-blur`, `role-sales`, `role-fintech`, `role-dev`, `auto-replace`, `data-replacement`), and sanitized first-touch UTM metadata onto the Checkout Session, `subscription_data.metadata`, and `payment_intent_data.metadata`.

3. **Financial events (`supabase/functions/stripe-webhook`)**
   - Verifies `stripe-signature` via `stripe.webhooks.constructEventAsync`.
   - Emits idempotent PostHog events (`$insert_id` per Stripe object/event):
     - `invoice_paid` on recurring `invoice.paid` (`month`, `year` with `mrr_usd` normalized `/ 12` for annual plans) and on `checkout.session.completed` for one-time `$59` `lifetime` purchases (`mrr_usd = 0`), including exact `net_cash_usd` after Stripe fees and taxes.
     - `invoice_refunded` on `charge.refunded` (incremental delta) and `charge.dispute.created`.
     - `subscription_canceled` on `customer.subscription.deleted`.

---

## 2. Deploy Supabase Secrets & Functions

Create a dedicated **Screen Privacy Blur** project inside your PostHog organization, then set secrets on Supabase project `rqwssmxjpphxngrncjfb`:

```bash
supabase secrets set \
  POSTHOG_PROJECT_API_KEY="phc_..." \
  POSTHOG_HOST="https://eu.i.posthog.com" \
  STRIPE_WEBHOOK_SECRET="whsec_..."
```

*(Use `https://us.i.posthog.com` if your PostHog organization is hosted in the US region.)*

Deploy the Edge Functions:

```bash
supabase functions deploy create-checkout-session --no-verify-jwt
supabase functions deploy web-telemetry --no-verify-jwt
supabase functions deploy stripe-webhook --no-verify-jwt
```

---

## 3. Configure the Stripe Webhook Endpoint

In **Stripe Dashboard → Developers → Webhooks → Add endpoint**:

- **Endpoint URL:** `https://rqwssmxjpphxngrncjfb.supabase.co/functions/v1/stripe-webhook`
- **Events to listen to:**
  - `invoice.paid`
  - `checkout.session.completed`
  - `charge.refunded`
  - `charge.dispute.created`
  - `customer.subscription.deleted`

Copy the Signing Secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` above.

---

## 4. Provision the "Founder 5 Metrics" Dashboard in PostHog

Create a PostHog Personal API Key with `dashboard:write` and `insight:write` scopes, then run:

```bash
POSTHOG_PERSONAL_API_KEY="phx_..." \
POSTHOG_PROJECT_ID="<your_posthog_project_id>" \
POSTHOG_APP_HOST="https://eu.posthog.com" \
node scripts/posthog/provision-dashboard.mjs
```

This creates (or updates in-place) a pinned dashboard containing all 5 core SaaS metrics:
1. **Revenue Retention (GRR & NRR by MRR)** — HogQL cohort table normalizing annual plans across 12 months.
2. **Conversion to Paid (30d Cohort Funnel)** — `extension_installed` -> `paywall_viewed` -> `invoice_paid` broken down by `initial_utm_source`.
3. **Paid CAC vs Blended CAC** — HogQL monthly table separating paid UTM channels from organic Chrome Web Store installs.
4. **Net LTV 30d** — HogQL cohort table of net cash after Stripe fees, taxes, and refunds in days `0..30` (`All`, `Monthly`, `Yearly`, `Lifetime`).
5. **DAU / WAU / MAU & Stickiness (`DAU / MAU %`)** — Trends insights on `extension_active_day`.
