# afhcgolf.net

Static site for the AFHC Golf Classic (Alpha Foundation of Howard County), rebuilt from the old WordPress site.

- **Frontend:** Astro 5, static output, no client framework yet (React can be added for the leaderboard app).
- **Backend (Amplify Gen 2):** a contact-form Lambda (function URL → SES) and a private S3 bucket + CloudFront for `/uploads/*` photos.
- **Payments:** none on-site. Registration, sponsorships and donations all go to Zeffy.

## What changes each year

`src/data/event.ts`: edition, date, course, fees, schedule, Zeffy link and `status`:

| status | Home page | Sponsors page |
|---|---|---|
| `open` | Register button → Zeffy | "Choose …" buttons → Zeffy |
| `soldout` | "Sold out", points to sponsorship | buttons → Zeffy |
| `past` | thank-you line, points to photos | "Ask about {next year}" → contact form |

Sponsor levels: `src/data/sponsors.json`. Photos and sponsor logos: `src/data/media.json`.

## Local development

```bash
npm install
tar -xf ~/afhcgolf-uploads.tar -C public/      # creates public/uploads (git-ignored)
npm run dev                                    # http://localhost:4321
npm run test:contact                           # contact-form validation tests
```

## First deploy

1. **Push to GitHub** (e.g. `EricObiri/afhcgolf-site`) and connect the repo in the Amplify console in the AWS account this client should live in. Amplify reads `amplify.yml`, deploys the backend, then builds the site.
2. **SES:** verify the domain identity `afhcgolf.net` in SES in that account and region. Add the DKIM CNAMEs in Cloudflare as **DNS only**. Then request production access, or the function can only send to verified addresses. Set `CONTACT_TO` in `amplify/functions/contact/resource.ts` to the address the committee reads.
3. **Upload the photos** once the backend exists. The bucket name is in `amplify_outputs.json` (`custom.mediaBucket`):
   ```bash
   mkdir -p ~/afhcgolf-media && tar -xf ~/afhcgolf-uploads.tar -C ~/afhcgolf-media
   AWS_PROFILE=<profile> aws s3 sync ~/afhcgolf-media/uploads s3://<mediaBucket>/uploads \
     --cache-control "public, max-age=31536000, immutable"
   ```
4. **Redirects:** paste `amplify-redirects.json` into Amplify → Hosting → Rewrites and redirects. These are real 301s for the old WordPress URLs. The build also emits fallback redirect pages.
5. **Custom domain:** in Amplify → Custom domains, add `afhcgolf.net` and `www`. Amplify gives you CNAME records. Add them in Cloudflare as **DNS only (grey cloud)**, since Amplify runs its own CloudFront and certificate. Cloudflare's CNAME flattening handles the apex.

## Layout

```
src/data/        event.ts, sponsors.json, media.json   ← content
src/pages/       index, tournament-information, sponsors, scholarship-program (md),
                 gallery, contact-us, leaderboard (placeholder), 404
src/components/  Header, Footer, Scorecard
src/lib/media.ts PUBLIC_MEDIA_BASE + /uploads path
amplify/         backend.ts (function URL, SES policy, media bucket + CDN), functions/contact/
redirects.json   old WordPress URL → new page (used by astro.config + amplify-redirects.json)
```
