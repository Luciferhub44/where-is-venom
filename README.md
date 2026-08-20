# Where Is Venom? — Web App

A donations + fundraising site for Queen Xtelle's "Where Is Venom?" story,
built with Next.js (App Router) and Paystack, ready to deploy on Vercel.

## What's included

- A light, warm editorial look — ivory/cream base, deep amber-gold accents,
  Playfair Display + Jost typography. No dark backgrounds anywhere.
- The full 12-episode story timeline, each entry with its own embedded video
  (played straight from `public/episodes/`).
- **"2,000 Cups for Venom"** campaign section: a 3-day, 2,000-cup fundraising
  drive built around the XS Skin Glow Herbal Soap photo, with a live progress
  bar (currently seeded at 60 cups claimed) and countdown timer. Sponsoring
  checks out directly — no cart, no shipping form, just quantity + email.
- **Donations**: quick-donate tiers + custom amount, in NGN or USD.
- **Paystack integration**: transaction amount is always computed
  server-side (never trusted from the browser), checkout via Paystack's
  hosted payment page, a webhook endpoint that verifies signatures and
  updates the cups counter, and a success page that verifies the
  transaction before showing confirmation.
- A small floating NGN / USD toggle (top-right of every page) instead of a
  header bar.
- Social links and every icon (heart, check, chevron, +/-, YouTube, TikTok,
  Instagram, mail) use `react-icons` — no emoji anywhere in the UI.

There is no merch shop or cart in this version — it was removed. If you want
it back later, the previous build had a `lib/products.ts` catalog, a
`CartProvider`, and an `/cart` checkout page you can reintroduce as a
starting point.

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get these from your Paystack dashboard: **Settings → API Keys & Webhooks**
(https://dashboard.paystack.com/#/settings/developers). Use the **Test**
keys while developing.

```bash
npm run dev
```

Visit http://localhost:3000.

## 2. Episode videos

Twelve videos live in `public/episodes/`. They're matched to episode
numbers 1–12 in `lib/episodes.ts` (`EPISODES` array, each with a `video`
field holding the exact filename). The filenames are the original long
captions the videos were exported with — that's intentional, nothing was
renamed, so the app matches what's already on disk. If you'd rather use
shorter filenames, rename the files in `public/episodes/` and update the
matching `video` field in `lib/episodes.ts` to match.

Videos use `preload="none"` so the page doesn't try to load all 12 at once —
each one loads only once a visitor presses play.

## 3. Deploy to Vercel

```bash
npm install -g vercel   # if you don't have it
vercel login
vercel                  # first deploy, follow the prompts
```

Then in the Vercel dashboard, open the project → **Settings → Environment
Variables** and add:

| Name | Value |
|---|---|
| `PAYSTACK_SECRET_KEY` | your Paystack secret key (test or live) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | your Paystack public key |
| `NEXT_PUBLIC_SITE_URL` | your production URL, e.g. `https://where-is-venom.vercel.app` |
| `ADMIN_PASSWORD` | password for the `/admin` donations dashboard (see below) |
| `RESEND_API_KEY` | for donation/cup confirmation emails (see below) |

Redeploy after adding env vars (`vercel --prod`), or push to your connected
Git repo and let Vercel pick the vars up on the next build.

**Heads up on repo/deploy size:** the 12 episode videos in `public/episodes/`
add up to roughly 130–140MB. That's fine for Vercel's static hosting, but if
you're pushing to GitHub, check your plan's repository size limits, or
consider Git LFS if it grows further.

### Connect a GitHub repo (recommended instead of CLI deploys)

1. Push this folder to a new GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset auto-detects as Next.js — no changes needed.
4. Add the environment variables above before the first deploy (or right
   after, then redeploy).

## 4. Set up the Paystack webhook (recommended)

The webhook is what keeps the "cups sponsored" counter accurate and gives
you a durable record of `charge.success` events even if someone closes the
tab before the success page finishes verifying.

1. Paystack Dashboard → **Settings → API Keys & Webhooks**.
2. Set the webhook URL to: `https://<your-domain>/api/paystack/webhook`
3. Save. Paystack signs every request with your secret key; the route at
   `app/api/paystack/webhook/route.ts` verifies that signature before doing
   anything.

## 5. Optional: live cup counter across serverless invocations

Without extra setup, the "cups sponsored" progress bar falls back to a
static number (`CAMPAIGN_FALLBACK_CUPS_SPONSORED = 60` in `lib/campaign.ts`)
and won't persist between requests. To make it live:

1. In your Vercel project: **Storage → Create Database → Redis** (Upstash).
2. Connect it to this project — Vercel injects the needed env vars
   automatically (either `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
   or the legacy `KV_REST_API_URL` / `KV_REST_API_TOKEN` names — this app
   reads either).
3. Redeploy. The webhook will now increment a real counter every time a cup
   is sponsored, starting from whatever the fallback says until the first
   real purchase lands.

This step is entirely optional — checkout and donations work without it.

## 6. Customize before launch

- **Campaign dates**: edit `CAMPAIGN_START_ISO` in `lib/campaign.ts` to your
  real launch date/time — the countdown and "3 Days" badge are both driven
  from this.
- **Cup price / claimed count**: `CUP_PRICE` and
  `CAMPAIGN_FALLBACK_CUPS_SPONSORED` in `lib/campaign.ts`.
- **Donation tiers**: `lib/donations.ts` — NGN and USD are set
  independently, no live FX conversion.
- **Episode copy**: `lib/episodes.ts`. Episodes 6–12 currently use trimmed
  excerpts of the real captions the videos were posted with (some cut off
  mid-sentence where the source caption itself was truncated) — feel free
  to replace with the full original captions.
- **Social links**: `components/Footer.tsx`.
- **Currency support**: Paystack's NGN channel works out of the box on any
  Nigerian merchant account. USD (and other non-NGN currencies) may require
  your Paystack account to be specifically enabled for that currency —
  check **Settings → Preferences** in your Paystack dashboard if USD
  checkout fails.

## 7. Admin dashboard (`/admin`)

There's still no full database — Paystack's own dashboard remains the
authoritative record of every charge. But every completed donation and cup
purchase is *also* logged to Redis from the webhook (name, phone, shipping
address, prayer note, amount, reference — everything attached as
`metadata`), and `/admin` gives you a simple internal view of that log:
totals by currency, total cups sponsored, a searchable-by-eye table of every
transaction, and a **CSV export** button.

Setup:

1. Set `ADMIN_PASSWORD` (see the env var table above) — a single shared
   password, no user accounts. Pick something strong.
2. Requires the Redis connection from step 5 above. Without Redis, `/admin`
   still loads (and the login still works), but the table stays empty since
   there's nowhere to log transactions.
3. Visit `https://<your-domain>/admin`, sign in, and you're in.

This only covers transactions from the point Redis was connected onward —
it does not backfill from Paystack's history. The dashboard is excluded from
the sitemap and `robots.txt` (`noindex`, disallowed for crawlers).

## Confirmation emails (Resend)

Every successful donation and cup purchase gets a branded confirmation email,
sent from the webhook via [Resend](https://resend.com) once `charge.success`
fires — before the counter/log update in step 6 above.

1. Verify your sending domain in Resend (already done for
   `whereisvenom.com`) and get an API key with sending access:
   **Resend Dashboard → API Keys**.
2. Set `RESEND_API_KEY` (see the env var table above), locally and on
   Vercel.
3. Sender identity is hardcoded in `lib/resend.ts`:
   `Where Is Venom? <noreply@whereisvenom.com>`, replies routed to
   `queenxtelle@gmail.com`. Change either there if needed.
4. Templates live in `lib/emails.ts` — one for donations, one for cup
   purchases (includes the shipping address and prayer note). Both are
   plain inline-styled HTML (table-based, no external CSS) so they render
   consistently across email clients.

Without `RESEND_API_KEY` set, the webhook logs a warning and skips the email
— it never blocks or fails the payment itself.

## SEO

- `app/layout.tsx` sets full metadata: title template, description,
  keywords, Open Graph + Twitter card images (`public/images/cup.png` — swap
  in a proper 1200×630 image when you have one), canonical URL, and a
  `WebSite` JSON-LD block.
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and
  `/robots.txt` from `NEXT_PUBLIC_SITE_URL` — set that env var correctly in
  both `.env.local` and Vercel or the URLs will be wrong.
- `/checkout/*`, `/cart`, `/admin`, and `/api/*` are all excluded from the
  sitemap and disallowed in `robots.txt` — none of them are pages a search
  engine should index.

## How sponsorships and donations are recorded

Paystack's dashboard is still the definitive source of truth for every
charge. The Redis-backed transaction log described above (and the `/admin`
dashboard that reads it) is a convenience layer on top of that, not a
replacement — if you ever need a full relational database, add one (Vercel
Postgres, Supabase, etc.) and write records inside
`app/api/paystack/webhook/route.ts`, where `charge.success` is already being
handled.

## Project structure

```
app/
  page.tsx                       Landing page (server component)
  sitemap.ts / robots.ts         Generated /sitemap.xml and /robots.txt
  checkout/success/page.tsx      Payment verification + confirmation
  admin/page.tsx                 Donations & cup purchases dashboard (password-gated)
  api/paystack/initialize/       Starts a Paystack transaction (server-priced)
  api/paystack/verify/           Verifies a transaction by reference
  api/paystack/webhook/          Paystack webhook (signature-verified)
  api/cups-progress/             Live cups-sponsored counter
  api/admin/                     Admin login/logout + CSV export
components/                      UI building blocks
lib/                             Episodes, campaign config, currency, Paystack + Redis helpers, admin auth
public/episodes/                 The 12 episode videos
public/images/                   Campaign product photo
```
