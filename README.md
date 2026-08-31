# Muhlah · Cybersecurity Transformation — Executive Progress Report

An interactive executive website for Muhlah Zamaniyah Financing Company's cybersecurity
programme. Plain HTML, CSS and JavaScript — no frameworks, no build step, no CDN or
other external dependency.

**Confidential · Board & ExCo** · Reporting date 24 August 2026 · Nusaybah Alharbi, Cybersecurity Lead

Live site: <https://nusaybahalharbi.github.io/Cybersecurity-Progress-/>

---

## What's in it

Eight sections, each reachable from the fixed header:

| Section | Contents |
|---|---|
| **Home** | Branding, report title, reporting date, confidentiality classification, executive summary, **View Progress** button |
| **Executive Summary** | Animated KPI cards, delivery ring, status distribution, the two completed milestones |
| **Progress** | All 12 initiatives plus 2 completed milestones — filterable by status, each opening a detail modal |
| **Roadmap** | Visual timeline: completed milestones with confirmed dates, then Stages 1–3 |
| **Solutions** | Interactive solution cards with status, purpose, value and stage; budget by category and by component |
| **Documentation** | The 13 → 57 documentation milestone with animated counters, governance achievements and outstanding assurance |
| **Team** | The two SAMA-required roles; DFIR / SOC L2 Specialist marked **Recruitment completed**, joining 1 September 2026 |
| **Next Steps** | Achievements, risks, dependencies, next steps, and the decisions required from the Executive Committee |

### Interaction

| Feature | How |
|---|---|
| Navigate | Header buttons, side dots (desktop), or **← / →** |
| Presentation mode | **P**, the ▶ header button, or **Presentation mode** on the landing page. One section per screen with Previous / Next controls and a section counter. **Esc** exits. |
| Full screen | **F** or the ⛶ header button |
| Print / PDF | **🖨** header button, or **Ctrl/Cmd + P** |
| Initiative details | Click any initiative card. **Esc** or click outside to close. |
| Filter initiatives | All · Completed · In Delivery · In Procurement · In Progress · Blocked |
| Position indicator | Progress bar across the top, plus the active nav button and side dots |

Everything is real HTML text — selectable, searchable with Ctrl+F, and readable by screen
readers. There are no slide screenshots anywhere: the only image file in the project is
the Muhlah logo. All icons are inline SVG and all charts, bars, rings and timelines are
CSS and SVG components.

---

## Files

```
.
├── index.html          All eight sections
├── css/styles.css      Muhlah palette, layout, animations, print theme
├── js/app.js           Navigation, counters, filters, modals, tabs, presentation mode
├── assets/
│   └── muhlah-logo.png The only image in the project
├── .nojekyll           Tells GitHub Pages to serve the folders as-is
└── README.md
```

All paths are relative (`assets/…`, `css/…`, `js/…`) with no leading `/`, so the site
works correctly when hosted under a repository subpath such as
`/Cybersecurity-Progress-/`.

---

## Running it locally

**Just open it.** Double-click `index.html`, or drag it into Chrome, Edge, Safari or
Firefox. Everything is local, so it works straight from the file system.

**Or serve it** (closest to how GitHub Pages will behave):

```bash
cd Cybersecurity-Progress-
python3 -m http.server 8080
```

Then open <http://localhost:8080>. With Node.js instead: `npx serve .`

---

## Publishing to GitHub

If the repository already exists, replace its contents with this project — `index.html`
must sit in the repository root — then commit and push:

```bash
git add -A
git commit -m "Rebuild as interactive executive cybersecurity progress website"
git push
```

Setting it up from scratch:

```bash
cd Cybersecurity-Progress-
git init
git add .
git commit -m "Muhlah cybersecurity executive progress website"
git branch -M main
git remote add origin https://github.com/nusaybahalharbi/Cybersecurity-Progress-.git
git push -u origin main
```

> This report is classified **Confidential · Board & ExCo**. GitHub Pages sites on a
> public repository are visible to anyone with the URL. Use a private repository unless
> the content has been approved for publication — note that Pages on a private repository
> requires a GitHub Team or Enterprise plan.

---

## Enabling GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **Deploy from a branch**.
4. Set **Branch** to `main` and the folder to **`/ (root)`**.
5. Click **Save**.
6. Wait roughly a minute, then reload the Pages settings page. The site will be live at:

```
https://nusaybahalharbi.github.io/Cybersecurity-Progress-/
```

The `.nojekyll` file stops GitHub from running Jekyll over the project, so `css/`, `js/`
and `assets/` are published exactly as they are. Because every path is relative, no
further configuration is needed for the repository subpath.

---

## Presenting to the Executive Committee

1. Open the site and press **F** for full screen.
2. Press **P** to enter presentation mode — one section fills the screen at a time.
3. Move with **← / →** or the **Previous / Next** buttons. The counter shows your position.
4. Press **Esc** to leave presentation mode and return to normal scrolling.

The layout is comfortable on a 16:9 projector and reflows properly on tablet and phone.

## Exporting a PDF

Click the **🖨** button, or press **Ctrl/Cmd + P**. Then choose:

- **Destination:** Save as PDF
- **Layout:** Landscape
- **Background graphics:** On

The print stylesheet switches the deck to a light, ink-friendly theme, breaks each section
onto its own page, and expands every initiative's detail panel — so nothing that lives
inside a modal on screen is missing from the PDF. Chrome or Edge give the most accurate
result.

---

## Editing the content

All content is written directly in `index.html`, one `<section class="section">` per
navigation entry. Navigation, side dots, the presentation counter and the scroll-spy are
all generated from those sections, so adding or removing a section needs no change to the
JavaScript beyond adding the matching header link.

Brand tokens are defined once at the top of `css/styles.css`:

| Token | Value | Use |
|---|---|---|
| `--navy-800` | `#0F2536` | Primary background |
| `--cyan-400` | `#5FC6F5` | Primary accent, section labels, in-delivery status |
| `--green` | `#2FBF8C` | Completed status |
| `--gold` | `#E0A53C` | In-procurement / in-recruitment status, confidentiality |
| `--steel` | `#C4D6E3` | Secondary text |
| `--ice` | `#EAF3FA` | Body text |

The `@media print` block re-points these same tokens to their ink equivalents, which
re-themes the entire document for PDF export without duplicating any rules.

---

## Content note

Two figures are reproduced exactly as they appear in the source material and have not been
reconciled:

- The executive summary reports **55** governance documents developed with **53** pending
  approval, while the documentation milestone reports a current total of **57**
  cybersecurity documents.
- The twelve budget components listed sum to **SAR 650,000**, while the approved envelope
  is stated as **SAR 665,000**.

Both are flagged in the relevant sections. Please reconcile them against the source
records before the figures are used externally.

---

## Browser support

Current Chrome, Edge, Firefox and Safari on desktop, tablet and phone. Requires CSS custom
properties and the Fullscreen API. Respects `prefers-reduced-motion`: animations and
smooth scrolling are disabled automatically for viewers who ask for that. No internet
connection is needed once the files are on disk.
