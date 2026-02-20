# 🐾 Corgi Capital — Deployment Guide

Step-by-step instructions to get corgi.capital live. This will take about 30 minutes.
No coding required — just clicking.

---

## STEP 1: Create a GitHub Account (if you don't have one)

1. Go to **github.com**
2. Click "Sign up" and create a free account
3. Verify your email

---

## STEP 2: Upload the Site to GitHub

1. Go to **github.com** (logged in)
2. Click the **"+"** in the top right → **"New repository"**
3. Name it: `corgi-capital`
4. Set it to **Private** (recommended)
5. Click **"Create repository"**
6. On the next page, click **"uploading an existing file"**
7. Drag the entire `corgi-capital` folder contents into the upload area
   *(Upload all files and folders)*
8. Click **"Commit changes"**

---

## STEP 3: Create a Netlify Account

1. Go to **netlify.com**
2. Click "Sign up" → choose "Sign up with GitHub" (easiest)
3. Authorize Netlify to access your GitHub

---

## STEP 4: Deploy to Netlify

1. On your Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub**
3. Select your `corgi-capital` repository
4. Build settings:
   - Build command: *(leave blank)*
   - Publish directory: `.` (just a dot)
5. Click **"Deploy site"**
6. Wait ~1 minute — your site will be live at a random URL like `happy-corgi-123.netlify.app`

---

## STEP 5: Connect Your Domain (corgi.capital)

1. In Netlify, go to **Site settings → Domain management**
2. Click **"Add custom domain"**
3. Enter: `corgi.capital`
4. Netlify will show you DNS records to add
5. Log into wherever you bought `corgi.capital` (likely Namecheap, GoDaddy, or Porkbun)
6. Add the DNS records Netlify shows you
7. Wait up to 24 hours for it to propagate (usually much faster)
8. Netlify will automatically add a free SSL certificate

---

## STEP 6: Enable the CMS (so you can write posts easily)

1. In Netlify, go to **Site settings → Identity**
2. Click **"Enable Identity"**
3. Under "Registration", set to **"Invite only"** (so only you can log in)
4. Go to **Site settings → Identity → Services**
5. Click **"Enable Git Gateway"**
6. Now go to **Site settings → Identity** and click **"Invite users"**
7. Invite your own email address
8. Check your email and accept the invite
9. Go to `corgi.capital/admin` to access your content manager
10. You can now write new posts through the browser interface!

---

## STEP 7: Add a Photo of Mango

To replace the SVG placeholder with a real photo:

1. Put Mango's photo in `public/images/` and name it `mango.jpg`
2. In `index.html`, find the SVG in the sidebar and replace with:
   ```html
   <img src="public/images/mango.jpg" alt="Mango" class="about-img" />
   ```
3. Do the same in `about.html`
4. Upload the updated files to GitHub

---

## How to Write New Posts

Once the CMS is set up (Step 6):

1. Go to `corgi.capital/admin`
2. Log in with your email
3. Click **"New Post"**
4. Fill in: Title, Category, Link (if it's a link post), Excerpt, and your Commentary
5. Click **"Publish"**

*Note: After publishing through the CMS, Netlify will automatically rebuild and update your site within ~1 minute.*

---

## The Easter Egg 🐾

Click the small Corgi logo in the top-left header to launch **Corgi Run** — the endless runner game. Jump over Bloomberg terminals, NYC pigeons, and crashing stock charts. Press `SPACE` or tap to jump.

---

## Need Help?

Just ask! This entire site was built to be easy to maintain.
