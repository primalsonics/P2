# Daniel Murimi Njiraini — Portfolio

A single-page portfolio site built with **Bootstrap 5**, vanilla **JavaScript**, and a small
**PHP** contact-form backend. Theme: a warm dusk gradient with an animated film-grain
overlay, and a "ticket / dispatch log" visual language that nods to a customer-support
and operations background.

```
portfolio/
├── index.html              ← the entire site (one page, anchor-linked sections)
├── README.md                ← you are here
├── .gitignore
├── css/
│   └── style.css           ← all visual styling (gradient, grain, layout, components)
├── js/
│   ├── grain.js             ← renders the animated film-grain canvas
│   └── main.js              ← scroll-reveal, nav state, contact form logic
├── php/
│   └── contact.php         ← contact form handler (needs a PHP-capable host)
└── assets/
    ├── img/                 ← put any project screenshots / photos here
    └── cv/                  ← put your CV PDF here (see the note inside)
```

Bootstrap, Bootstrap Icons, and the Google Fonts used (Fraunces, IBM Plex Sans/Mono)
are all loaded from public CDNs in `index.html` — there's nothing to install locally to
preview the site.

---

## 1. Customize it

All the visible text is placeholder content based on a generic profile — replace it with
your own:

- **Hero, About, Skills, Work sections** — edit the text directly in `index.html`.
- **Colors / fonts** — all defined as CSS variables at the top of `css/style.css`
  (`:root { --teal-deep, --amber, --gold, ... }`).
- **Contact email / social links** — search `index.html` for `mailto:` and the
  LinkedIn/GitHub placeholder URLs in the Contact section.
- **CV download link** — drop your PDF in `assets/cv/` (see the note file in that
  folder for the exact filename it expects).
- **contact.php** — open `php/contact.php` and change the `$ownerEmail` variable near
  the top to your real email address.
- **main.js** — there's a matching `ownerEmail` constant near the bottom of the file,
  used only as a fallback if the contact form can't reach PHP (see §3 below).

---

## 2. Preview it locally (no install required)

PHP's built-in server is the fastest way to test the contact form before deploying:

```bash
cd portfolio
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser. If you don't have PHP installed
locally, you can still preview the static design by simply opening `index.html`
directly in a browser — only the contact form needs PHP.

---

## 3. Push it to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repository on GitHub first, via the "New repository" button — don't
initialize it with a README there, to avoid a merge conflict with your first push.)

---

## 4. Hosting options

⚠️ **Important:** GitHub Pages only serves static files — it cannot run PHP. Pick the
path that matches what you need:

### Option A — GitHub Pages (free, static only, contact form needs a small tweak)

1. In your GitHub repo, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to "Deploy from a branch".
3. Choose the `main` branch and the `/ (root)` folder, then **Save**.
4. Your site will be live at `https://<your-username>.github.io/<your-repo>/` within a
   minute or two.

Since `php/contact.php` won't execute here, the form's JavaScript (`js/main.js`)
already detects this automatically: if it can't get a real response from PHP, it falls
back to opening the visitor's email client with a pre-filled message instead. The form
still works — it just hands off to email rather than emailing server-side.

If you'd prefer a server-side form on a static host, swap the `fetch("php/contact.php")`
call in `js/main.js` for a free form service instead, e.g.
[Formspree](https://formspree.io) or [EmailJS](https://www.emailjs.com) — both have a
few lines of drop-in JavaScript and don't need PHP.

### Option B — Self-host with real PHP support

Use this if you want the PHP contact form to actually run.

**Free PHP hosting (good for a personal portfolio):**
1. Sign up for a free PHP host such as [InfinityFree](https://infinityfree.net) or
   [000webhost](https://www.000webhost.com).
2. Upload the contents of the `portfolio/` folder via their File Manager or FTP
   (most also support pulling directly from a GitHub repo — check their dashboard).
3. Visit your assigned domain — the contact form will now hit `php/contact.php` for
   real and attempt to email you.

**Your own VPS (e.g. DigitalOcean, Linode, a Raspberry Pi, etc.):**
```bash
# Example for Ubuntu/Debian with Apache
sudo apt update
sudo apt install apache2 php libapache2-mod-php -y

# Clone your repo straight into Apache's web root
cd /var/www/html
sudo git clone https://github.com/<your-username>/<your-repo>.git .
sudo systemctl restart apache2
```
Then point your domain's DNS A record at the server's IP address.

**Local-network / testing only (XAMPP or MAMP):**
1. Install [XAMPP](https://www.apachefriends.org) (Windows/Linux) or
   [MAMP](https://www.mamp.info) (macOS).
2. Copy the `portfolio/` folder into the `htdocs` directory it creates.
3. Start Apache from the XAMPP/MAMP control panel and open
   `http://localhost/portfolio/`.

---

## 5. After deploying

- Test the contact form end-to-end and check `php/submissions.log` appears on the
  server — it's a backup copy of every message, kept even if `mail()` isn't configured
  on your host yet.
- Run the site through your browser's Lighthouse/Accessibility audit — the markup
  already includes a skip link, visible focus states, and respects
  `prefers-reduced-motion` for the gradient and grain animations.
- Update the placeholder project cards in the "Work" section with real screenshots or
  links as soon as you have something to show.
