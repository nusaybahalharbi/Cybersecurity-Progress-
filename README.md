# Muhlah · Cybersecurity Transformation — Executive Progress Report

An interactive executive website for Muhlah Zamaniyah Financing Company's cybersecurity
programme. Plain HTML, CSS and JavaScript — no frameworks, no build step, no CDN or
other external dependency.

**Confidential · Board & ExCo** · Reporting date 1 September 2026 · Nusaybah Alharbi, Cybersecurity Lead

Live site: <https://nusaybahalharbi.github.io/Cybersecurity-Progress-/>

---

## What's in it

Nine sections, each reachable from the fixed header, ordered as an executive narrative:

| # | Section | Narrative role |
|---|---|---|
| 1 | **Home** | Starting position, business value, headline figures, Enter Executive Dashboard |
| 2 | **Executive Summary** | Current posture — KPI cards, delivery ring, status distribution |
| 3 | **Overview** | Achieved / Being implemented / Remaining / Needs management support |
| 4 | **Progress** | Active initiatives — 14 filterable cards with detail modals |
| 5 | **Roadmap** | Sequence and milestones — clickable timeline with a status legend |
| 6 | **Solutions** | Cybersecurity Capabilities & Technology Landscape — 21 capabilities across 8 domains |
| 7 | **Documentation** | Achievements — the 13 → 57 milestone and governance evidence |
| 8 | **Team** | Team development — the two SAMA-required roles |
| 9 | **Next Steps** | Risks, dependencies, priorities and decisions required |

### Interaction

| Feature | How |
|---|---|
| Navigate | Header buttons, side dots (desktop), or **← / →**, **Page Up / Page Down**, **Home / End** |
| Presentation mode | **P**, the **Presentation Mode** header button, or the landing-page button. Each section fills the screen, with the section name, "Section n of 9", an overall progress bar, and a discreet control bar. **Esc** exits. |
| Full screen | **F** or the ⛶ header button |
| Print / PDF | **🖨** header button, or **Ctrl/Cmd + P** |
| Initiative details | Click any initiative card. **Esc** or click outside to close. |
| Filter initiatives | All · Completed · In Delivery · In Procurement · In Progress · Planned · Blocked, with **Reset filters** |
| Roadmap details | Click any milestone to open its reporting period, scope and dependencies |
| Capability filters | All · Operational · Expansion in Progress · Implementation in Progress · Planned / Procurement · On-Demand, with **Reset filters**. Counters and chip counts are computed from the rendered cards at runtime, never hard-coded. |
| Position indicator | Progress bar across the top, plus the active nav button and side dots |

All KPI figures are written into the markup and animated from zero on first view only, so
the numbers stay correct and visible with JavaScript disabled or `prefers-reduced-motion`
set. Everything is real HTML text — selectable, searchable with Ctrl+F, and readable by
screen readers. There are no slide screenshots anywhere: the only image file in the project is
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

## Capability landscape

The Solutions section presents Muhlah's cybersecurity technology landscape in four status
groups, with each card tagged by capability domain and opening a detail modal:

| Group | Count | Members |
|---|---|---|
| **Operational** (green) | 9 | Netskope · BitRaser · Microsoft Purview DLP & Data Classification · CTM360 · KnowBe4 · Cognna SOC/SIEM · FortiGate · BlackBerry MDM · MFA |
| **Contracted or Purchased** (blue / cyan) | 3 | DiPu (contract signed, on demand) · ManageEngine ServiceDesk Plus, CMDB & Asset Discovery (paid, configuration in progress) · Qualys Vulnerability Management (selected, payment in progress) |
| **People Milestone** (completed badge) | 1 | DFIR / SOC L2 Specialist — recruitment completed, joining 1 September 2026 |
| **Remaining or Dependent** (amber) | 7 | GRC platform · NDR · Penetration testing · Red teaming · External SAMA CSF ML3 assessment (end of 2026) · BIA independent validation · Network segmentation (critical dependency) |

Colour system: green = operational, blue = purchased / configuration, cyan = selected /
payment, amber = planned / dependent, filled green tick badge = recruitment milestone.

Items absorbed into existing platforms and therefore **not** shown as separate procurement:
application whitelisting (delivered through Netskope), DLP and data classification
(delivered through Microsoft Purview), asset discovery (included in ManageEngine
ServiceDesk Plus), awareness platform (KnowBe4, implemented).

All counters and filter chip counts are computed from the rendered cards at runtime.

## Budget view

Two headline figures are shown exactly as supplied and are not recalculated:

- **Final Budget Request — SAR 665,000**: the approved / requested FY2026 capability-uplift
  budget presented in the budget sheet.
- **Total Cybersecurity Budget View — SAR 1,590,400**: the total cybersecurity budget
  reference view, including existing and provided capabilities, required capabilities,
  services, and contingency allocations.

An expandable disclosure maps each budget line to its current status. A per-component
breakdown is not displayed: the "Budget by component" view was removed because it
duplicated the same figures, and the underlying component sheet was not supplied with the
1 September 2026 update.

## Content note

Documentation figures are reported as two distinct numbers and must not be conflated:

- **57** cybersecurity documents developed and maintained
- **26** formally approved (31 not yet approved)

The site never states that all 57 documents are approved.

## Browser support

Current Chrome, Edge, Firefox and Safari. Layout verified with no horizontal scrolling and
no clipped cards at 1920×1080, 1366×768, 1024×768, 768×1024 and 390×844. Requires CSS custom
properties and the Fullscreen API. Respects `prefers-reduced-motion`: animations and
smooth scrolling are disabled automatically for viewers who ask for that. No internet
connection is needed once the files are on disk.
