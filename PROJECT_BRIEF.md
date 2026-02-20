# Corgi Capital — Project Brief
*Read this at the start of any new Claude Code session to get up to speed instantly.*

---

## What Is This?
A personal blog/investment journal disguised as a "family office" website. Playful and silly in tone. The site is live at **corgi.capital**.

## The Mascot
**Mango** — a real corgi, the smallest of the litter, belonging to the user's friend. Mango is the fictional CIO of Corgi Capital. Photo is at `public/images/mango.jpg`. Mango has deep thoughts about investments. Still a dog.

## Tone & Voice
- Playful, funny, self-aware
- Mango is referred to in the third person ("Mango thinks...", "Mango is working on this idea")
- Occasional self-deprecating humor ("Still a dog", "Not financial advice")
- Serious investment content is welcome but delivered with personality
- Footer always reads: "Not financial advice. Mango is a dog. Past performance does not predict future treats."
- **IMPORTANT: Never use gendered pronouns (he/she/his/her/him) when referring to Mango.** Use "Mango" by name or rephrase to avoid pronouns entirely. The writer's gender should not be identifiable from the site.

## Site Structure
- **corgi.capital** — live site
- **GitHub repo** — corgi-capital (user's GitHub account)
- **Hosting** — Netlify (auto-deploys when GitHub is updated)
- **All local files** — `/Users/davidchan/Documents/Claude/1st project/corgi-capital/`

## Categories
| Name | Emoji | File | Color | Description |
|------|-------|------|-------|-------------|
| The Pack | 🔗 | category-pack.html | #2A7AE8 | Links & reads with commentary |
| Mango's Picks | 📈 | category-picks.html | #27AE60 | Stock ideas |
| Zoomies | 🏃 | category-zoomies.html | #E74C3C | Fitness |
| Fire Hydrant | 🗽 | category-hydrant.html | #E67E22 | NYC life |
| Grey Muzzle | 🦳 | category-muzzle.html | #7F8C8D | Ageing |
| Off Leash | 🐾 | category-leash.html | #C0392B | Miscellaneous |

## Design
- **Colors:** Corgi orange (#E8732A), golden (#D4A843), cream (#FDF6EC), dark brown (#1A1208)
- **Fonts:** Playfair Display (headings), Merriweather (body), Inter (UI)
- **Logo:** Animated SVG corgi in the header — clicking it launches the easter egg game
- **Easter egg:** "Corgi Run" — endless runner game where Mango jumps over Bloomberg terminals, pigeons, and crashing stock charts. Hidden behind the header corgi logo click.

## Existing Posts
1. **Is Uber Actually a Way to Play the AV Trend?** — `post-uber-av.html` — The Pack — Feb 19, 2026
2. **Mango's First Website** — `post-first-website.html` — Off Leash — Feb 20, 2026
3. **My 40g Protein Breakfast** — `post-protein-breakfast.html` — Zoomies — Feb 20, 2026 (Hero bagels, eggs, avocado, 3 photos)

## How to Add a New Post

### Step 1: Create the post HTML file
Copy the structure from any existing post file (e.g. `post-uber-av.html`). Name it something like `post-[topic].html`. Key things to update:
- `<title>` tag
- Category span class (e.g. `cat-pack`, `cat-zoomies`, etc.) and the `class="active"` nav link
- Post date
- `<h1>` title
- Body content
- Link back to correct category page

### Step 2: Add the post card to `index.html`
Add a new `<article class="post-card cat-[category]">` block at the TOP of the feed (newest first), before the previous most recent post. Update the sidebar category count.

### Step 3: Add the post card to the category page
Replace or add to the `<div class="feed">` section in the relevant `category-[name].html` file.

### Step 4: Upload to GitHub
Go to github.com → corgi-capital repo → "Add file" → "Upload files" → drag in all changed/new files → "Commit changes". Netlify auto-deploys in ~30 seconds.

## For Link Posts (The Pack)
Include a `.post-link-preview` block with the URL, a 📰 icon, the article title, and the domain. See `post-uber-av.html` for reference.

## For Posts With Photos
- Save photos to `public/images/` as .jpg files
- Use the `.photo-grid` CSS class for a 3-column photo grid with lightbox (see `post-protein-breakfast.html`)
- HEIC files need to be converted: `sips -s format jpeg input.heic --out output.jpg`
- Photos from Messages app are permission-blocked — user needs to save them to Downloads first

## Technical Stack
- Plain HTML/CSS/JS (no framework)
- CSS lives in `src/styles/main.css`
- Easter egg game lives in `src/game.js`
- Netlify CMS set up at `corgi.capital/admin` (Netlify Identity enabled, Git Gateway enabled)
- `netlify.toml` handles routing
- Node 20 installed via nvm (needed if ever running local tools)

## Domain
- **corgi.capital** registered on **GoDaddy**
- Nameservers pointed to Netlify (dns1-4.p05.nsone.net)
- SSL certificate auto-provisioned by Netlify

## Things Still To Do / Nice To Haves
- The Netlify CMS saves markdown files but the site doesn't auto-render them — posts still need to be added as HTML manually (or the site could be rebuilt on a proper framework like Eleventy/Hugo later)
- Mango's photo in the about page could be updated to a better crop
- Category post counts in the sidebar are manually maintained — remember to update them when adding posts
