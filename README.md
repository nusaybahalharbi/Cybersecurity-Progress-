# Muhlah · Cybersecurity Transformation — Executive Progress Report

A self-contained, responsive web presentation (10 slides, 16:9) built from the
Muhlah cybersecurity board update. No frameworks, no CDNs, no build step — plain
HTML, CSS and JavaScript with all assets stored locally.

**Confidential · Board & ExCo**

---

## Contents

```
.
├── index.html          All 10 slides
├── css/styles.css      Muhlah branding, layout, transitions, print styles
├── js/app.js           Navigation, 16:9 scaling, full screen, PDF export
├── assets/
│   ├── muhlah-logo.png Muhlah logo (extracted from the source deck)
│   ├── cover-bg.jpg    Title slide background
│   └── closing-bg.jpg  Closing slide background
├── .nojekyll           Required so GitHub Pages serves the files as-is
└── README.md
```

---

## 1. Running it locally

**Option A — just open it (simplest).**
Double-click `index.html`, or drag it into Chrome, Edge, Safari or Firefox.
Everything is local, so it works straight from the file system.

**Option B — local web server (recommended for a final check before deploying).**

```bash
cd muhlah-exco
python3 -m http.server 8080
```

Then open <http://localhost:8080> in your browser.

If you have Node.js instead of Python:

```bash
npx serve .
```

---

## 2. Uploading it to GitHub

Create an empty repository on GitHub first (for example `muhlah-cyber-exco`),
**without** a README, then from inside this folder:

```bash
cd muhlah-exco
git init
git add .
git commit -m "Muhlah cybersecurity executive progress report"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Replace `<your-username>` and `<your-repo>` with your own values.

> This deck is marked **Confidential · Board & ExCo**. Use a **private**
> repository unless the content has been approved for publication. Note that
> GitHub Pages on a private repository requires a GitHub Team or Enterprise plan.

---

## 3. Enabling GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages** (left-hand menu).
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Set **Branch** to `main` and the folder to `/ (root)`.
5. Click **Save**.
6. Wait about a minute, then refresh the Pages settings screen. Your site will be
   live at:

   ```
   https://<your-username>.github.io/<your-repo>/
   ```

The included `.nojekyll` file stops GitHub from running Jekyll over the project,
so the `css/`, `js/` and `assets/` folders are published exactly as they are.

---

## 4. Presenting it in full-screen mode

Open the deck, then:

| Action | How |
|---|---|
| Enter / exit full screen | Press **F**, or click **⛶ Full screen** |
| Next slide | **→**, **Space**, **Enter**, **Page Down**, or **Next ▶** |
| Previous slide | **←**, **Backspace**, **Page Up**, or **◀ Prev** |
| Jump to first / last slide | **Home** / **End** |
| Exit full screen | **Esc** |
| Swipe (tablet) | Swipe left or right |

The slide canvas is a fixed 1920 × 1080 (16:9) stage that is scaled to fit
whatever screen or projector you are on, so the layout never breaks or reflows
mid-presentation. The current slide number is shown bottom-right on every slide
and in the control bar, with a progress bar across the top.

**Presenter tip:** open the deck, press **F**, and the on-screen controls stay
available at the bottom of the screen without covering slide content. You can
deep-link to a specific slide by adding its number to the URL — for example
`.../index.html#7` opens slide 7.

---

## 5. Exporting to PDF

Press **P**, or click **🖨 PDF**, or use your browser's **File → Print**. Then:

- **Destination:** Save as PDF
- **Layout:** Landscape
- **Margins:** None
- **Background graphics:** **On** (required — the deck is dark-themed)

Each slide prints as one page. Chrome or Edge give the most accurate result.

---

## 6. Editing the content

All slide content lives in `index.html`, one `<section class="slide">` per slide,
in presentation order. Slide numbers, the counter and the progress bar are
generated automatically from the number of `.slide` sections, so adding or
removing a slide needs no other change.

Brand colours are defined once at the top of `css/styles.css`:

| Token | Value | Use |
|---|---|---|
| `--navy-800` | `#0F2536` | Primary background |
| `--cyan-400` | `#5FC6F5` | Primary accent, section labels |
| `--green` | `#2FBF8C` | Completed status |
| `--gold` | `#E0A53C` | In-procurement / in-recruitment status |
| `--steel` | `#C4D6E3` | Secondary text |
| `--ice` | `#EAF3FA` | Body text |

---

## 7. Browser support

Tested against current Chrome, Edge, Firefox and Safari. Requires a browser with
CSS custom properties and the Fullscreen API — all mainstream browsers released
since 2020 qualify. No internet connection is needed once the files are on disk.
