# Portfolio — Abdulrahman Salem

A single-page portfolio built with plain **HTML, CSS and JavaScript**. No frameworks, no build
step, no dependencies. Open `index.html` and it runs.

```
my_portfolio/
├── index.html          all the page content
├── css/style.css       all the styling + animations
├── js/main.js          all the behaviour (projects list lives at the top)
└── assets/
    ├── img/            your photo + project poster images
    ├── videos/         your project demo recordings
    └── cv.pdf          your CV (add this file)
```

---

## 1. Things you must change

I filled these in with placeholders. Search for `✏️` in the files to jump to each one.

| What | Where | Current placeholder |
|---|---|---|
| **WhatsApp number** | `index.html` — 4 places | `https://wa.me/201000000000` |
| **LinkedIn URL** | `index.html` — 3 places | `.../in/your-username` |
| **GitHub URL** | `index.html` — 2 places | `.../your-username` |
| **Email** | `index.html` (3×) + `js/main.js` (`EMAIL`) | `abodysalem383@gmail.com` |
| **Your name** | `index.html` — title, nav, preloader, footer | `Abdulrahman Salem` |

> I guessed your name from your email address — change it everywhere if it's wrong.
> The preloader spells it out one letter per `<span>`, so adjust those if the length changes.

**WhatsApp format:** country code, no `+`, no spaces or dashes.
Egypt example: `201012345678`.

Fastest way to catch them all — open the folder in VS Code and use
**Find & Replace across files** (`Ctrl+Shift+H`) for `201000000000` and `your-username`.

---

## 2. Adding your projects and demo videos

Everything about the Work section lives in one array at the top of **`js/main.js`**:

```js
const PROJECTS = [
  {
    title: 'Multi-Vendor E-Commerce Platform',
    desc:  'A full marketplace where vendors manage their own storefronts…',
    tags:  ['Django', 'PostgreSQL', 'Stripe'],
    cats:  ['django', 'ecommerce'],       // filter buttons
    badge: 'Featured',                    // small label on the thumbnail
    video: 'assets/videos/ecommerce.mp4', // your screen recording
    youtube: '',                          // …or a YouTube id instead
    poster: 'assets/img/project-ecommerce.jpg',
    live:  'https://…',                   // "" hides the button
    code:  'https://github.com/…'         // "" hides the button
  },
  // add as many as you like
];
```

**Videos — two options:**

1. **Local file** — drop `myproject.mp4` into `assets/videos/` and set
   `video: 'assets/videos/myproject.mp4'`.
   Use **MP4 / H.264**, that plays in every browser. Keep it under ~10 MB if you can —
   big files make the page slow to load. Handbrake or CloudConvert will compress it.

2. **YouTube** — upload the recording (Unlisted works fine) and set
   `youtube: 'dQw4w9WgXcQ'` — just the id, the part after `?v=` in the URL.
   Better for long or heavy videos since YouTube handles the streaming.

Until a video file exists, clicking a card opens a panel telling you the exact path
to drop the file at. Nothing breaks.

**`cats`** must use these values so the filter buttons work:
`django` · `ecommerce` · `api` · `frontend`
(To rename or add a filter, edit the buttons in the `#filters` block in `index.html`.)

---

## 3. Your photo, posters and CV

| File | Goes at | Notes |
|---|---|---|
| Profile photo | `assets/img/profile.jpg` | Portrait, roughly 4:5. Shows your initials if missing. |
| Project posters | `assets/img/project-*.jpg` | 16:10, ~1200px wide. Shows a labelled placeholder if missing. |
| CV | `assets/cv.pdf` | Linked from the Download CV button in About. |

Every image degrades gracefully — nothing shows a broken icon if a file isn't there yet.

---

## 4. Content you'll probably want to rewrite

All in `index.html`, all plain text:

- **About** — three paragraphs, written in first person. Make them yours.
- **Stats** — `data-count="40"` on each `.counter`. Put real numbers here; inflated
  ones are easy for a client to catch.
- **Skill levels** — `data-level="95"` on each `.bar`, 0–100.
- **Journey** — four `.tl-item` blocks. **These are invented placeholders** — replace
  the years, job titles and descriptions with your real history.
- **Services** — six cards, keep the ones that match what you actually sell.

---

## 5. Running it

Double-clicking `index.html` works for everything except local video playback, which
some browsers block on `file://`. To preview it exactly as visitors will see it:

```bash
cd my_portfolio
python -m http.server 5510
```

Then open <http://localhost:5510>.

---

## 6. Putting it online (free)

**GitHub Pages** — create a repo, push these files, then Settings → Pages → deploy from
`main` / root. Live at `https://username.github.io/repo`.

**Netlify or Vercel** — drag the folder onto their dashboard. Done, with HTTPS and a
free subdomain.

Both are static hosts, which is all this needs. If you later want the contact form to
send email server-side instead of opening the visitor's mail app, point it at
[Formspree](https://formspree.io) — replace the `location.href = 'mailto:…'` line in
`js/main.js` with a `fetch()` POST to your Formspree endpoint.

Before you publish, update `<meta property="og:image">` in `index.html` and add
`assets/img/og-cover.jpg` (1200×630) — that's the preview image when the link is shared.

---

## 7. Notes on how it's built

- **One accent colour**, set once in `:root` in `css/style.css` as `--indigo`. Change
  that plus `--grad` and the whole site re-themes.
- **Scroll animations** are driven by a small rect-based watcher (`Watch` in `main.js`),
  not `IntersectionObserver`. IO callbacks silently never fire while a tab is
  backgrounded or occluded on some engines — and since every animated element starts at
  `opacity:0`, that failure mode renders a blank page. The watcher polls on startup as
  well as on scroll, so content always appears.
- **`prefers-reduced-motion`** is respected — animations, the custom cursor and the
  grain overlay all switch off, and text renders in its final state.
- **Keyboard accessible** — the project thumbnails are real buttons, the video modal
  traps focus and closes on `Esc`, and every interactive element has a visible focus ring.
- Works down to 320px wide.
