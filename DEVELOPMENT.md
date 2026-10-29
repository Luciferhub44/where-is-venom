# Where Is Venom?: Memorial Website & Handover Guide

This repository powers **[whereisvenom.com](https://whereisvenom.com)**, a memorial website and archive dedicated to the life and legacy of Venom, created and maintained by Queen Xtelle.

---

## 1. What was transformed

1. **Complete Removal of Fundraising**: All payment initialization (`/api/paystack/*`), checkout pages (`/checkout/*`), cup campaign counters, soap purchase forms, and donation tiers have been fully removed and disabled. The past campaign records remain safely archived in git branch `archive/fundraising-site` and in `/admin`.
2. **Memorial Hero**: Features an authentic, vibrant photograph of Venom (`public/images/venom-portrait.jpg`) celebrating his life, family roles, and legacy.
3. **12-Episode Story Archive**: All 12 original video episodes remain preserved with `preload="none"`, updated with the new archive heading, introduction, and a respectful visitor notice.
4. **Beyond the Journey**: 4 expandable memorial pillars celebrating *The Man We Knew*, *The Memories We Keep*, *The Love He Left Behind*, and *Letters & Tributes*.
5. **Share a Memory (Moderated)**: Visitors can submit tributes and stories. All entries are stored in the private admin queue and emailed to `queenxtelle@gmail.com` via Resend; no unmoderated submissions appear publicly.
6. **Gratitude Section**: Permanent expression of family gratitude replacing the former surgery appeals.
7. **Simplified Navigation & Footer**: Clean header navigation (`Home`, `His Story`, `Memories`, `Share a Memory`, `Contact`) and dignified footer with "Made with faith, love and remembrance."

---

## 2. How to update the website in future

### A. How to edit text or stories
- **Homepage headlines and introduction**: Edit [components/Hero.tsx](file:///Users/obsidian/Downloads/Where_is_Venom/where-is-venom/components/Hero.tsx).
- **Episode descriptions and quotes**: Edit [lib/episodes.ts](file:///Users/obsidian/Downloads/Where_is_Venom/where-is-venom/lib/episodes.ts).
- **Beyond the Journey text**: Edit [components/BeyondTheJourney.tsx](file:///Users/obsidian/Downloads/Where_is_Venom/where-is-venom/components/BeyondTheJourney.tsx).
- **Thank-You message**: Edit [components/ThankYou.tsx](file:///Users/obsidian/Downloads/Where_is_Venom/where-is-venom/components/ThankYou.tsx).
- **Social media and email links**: Edit [components/Footer.tsx](file:///Users/obsidian/Downloads/Where_is_Venom/where-is-venom/components/Footer.tsx).

### B. How to add or change photographs
1. Add your new image file into the `public/images/` folder (e.g. `public/images/venom-photo-2.jpg`).
2. Reference the image in [components/BeyondTheJourney.tsx](file:///Users/obsidian/Downloads/Where_is_Venom/where-is-venom/components/BeyondTheJourney.tsx) or [components/Hero.tsx](file:///Users/obsidian/Downloads/Where_is_Venom/where-is-venom/components/Hero.tsx):
   ```tsx
   <Image src="/images/venom-photo-2.jpg" alt="Description" width={800} height={600} />
   ```
3. Commit and push to GitHub: Vercel will automatically redeploy.

### C. How to review submitted memories
1. Visit `https://whereisvenom.com/admin` (or `http://localhost:3000/admin` locally).
2. Enter your `ADMIN_PASSWORD`.
3. The top section of the dashboard displays all memories submitted through the website, along with the sender's name, relationship, email, and message.
4. Notifications are also automatically emailed to `queenxtelle@gmail.com` when a new tribute is submitted (if `RESEND_API_KEY` is configured).

---

## 3. Local Development

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 4. Environment Variables

Configure these in your Vercel Project Settings (**Settings → Environment Variables**):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g., `https://whereisvenom.com`) |
| `ADMIN_PASSWORD` | Password for accessing the private `/admin` portal |
| `RESEND_API_KEY` | *(Optional)* Sends email notifications for new memory submissions to `queenxtelle@gmail.com` |
| `UPSTASH_REDIS_REST_URL` | *(Optional)* Persists memory submissions in Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | *(Optional)* Upstash Redis token |

---

## 5. Backups & Preserved Archives

Before transitioning to the memorial structure, full backups were taken:
- **Git Branch**: `archive/fundraising-site`
- **Git Tag**: `archive-fundraising-site`
- **Tarball Archive**: `../where-is-venom-backup-before-memorial.tar.gz`

All 12 original video files remain securely located in `public/episodes/`.
