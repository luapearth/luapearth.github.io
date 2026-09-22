# portfolio

Personal portfolio site for **John Paul Del Mundo** — software engineer, web &
mobile development, 10+ years.

Static HTML/CSS/JS. No build step, no dependencies, no framework. Open
`index.html` and it works.

## Structure

```
index.html                     the whole site (one page, section anchors)
styles.css                     design tokens + all styling
main.js                        mobile nav, scroll reveal, nav spy, copy-email
favicon.svg                    JP monogram
404.html                       GitHub Pages fallback page
.nojekyll                      stops Pages running Jekyll over the files
.github/workflows/pages.yml    deploys the repo root to GitHub Pages
```

## Local preview

There is no build step, so any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the filesystem also works, except that
`404.html` uses root-relative paths and needs a server.

## Deployment

Pushing to `main` triggers `.github/workflows/pages.yml`, which uploads the repo
root as a Pages artifact and deploys it. The Pages source is **Settings → Pages →
Build and deployment → Source: GitHub Actions**.

This repository is named `luapearth.github.io`, and that name is what makes it
serve at the domain **root** — `https://luapearth.github.io/`. A repo with any
other name is served under `https://luapearth.github.io/<repo>/` instead, so
renaming this repo changes the site's URL.

To use a custom domain, add **Settings → Pages → Custom domain** *and* commit a
`CNAME` file at the repo root containing the bare domain.

## Design system

Dark neon "Tokyo Night" Neubrutalism: flat fills, bright ink lines, hard offset
shadows, no gradients, no blur, no soft elevation.

The important inversion from a light neubrutalist theme: **in dark mode the
"ink" role is the light line, not black.** `--line` (`#c0caf5`) draws every
border and casts every hard shadow.

Tokens live at the top of `styles.css` under `:root`. Changing `--line`,
`--bg`, or `--bw` there re-skins the whole site.

| Token group | Values |
|---|---|
| Surfaces | `--bg` `#1a1b26`, `--bg-deep` `#16161e`, `--surface` `#1f2335`, `--surface-2` `#24283b` |
| Ink | `--line` `#c0caf5`, `--text-dim` `#a9b1d6`, `--muted` `#9099c4`, `--on-bright` `#16161e` |
| Neon accents | `--yellow` `#e0af68`, `--cyan` `#7dcfff`, `--magenta` `#bb9af7`, `--green` `#9ece6a`, `--orange` `#ff9e64`, `--blue` `#7aa2f7` |
| Reserved | `--red` `#f7768e`, `--teal` `#73daca` (defined, not yet used) |
| Type | Archivo Black (display), Space Grotesk (body), Space Mono (labels) |

`--on-bright` is the text colour for anything sitting on a neon fill. Every
neon accent is light, so text on it must be dark.

`404.html` is deliberately self-contained — it inlines the handful of tokens it
uses rather than linking `styles.css`, so it renders correctly at the root and
under a project base path alike. **If you change the palette, update it too.**

Fonts load from Google Fonts in `index.html`. To go fully self-hosted, drop the
`<link>` tags and vendor the `woff2` files locally — the `--font-*` variables
already isolate the family names.

## Editing content

Everything is in `index.html`, in plain markup. Section order in the page is
hero → capabilities → work → about → contact.

### Adding a project

The **Selected work** section currently renders a designed empty state
(`.empty`). When project content is ready, replace that `<div class="empty">`
block with a grid of cards and add the grid rule to `styles.css`:

```html
<div class="projects">
  <article class="project">
    <p class="project__tag">Web app</p>
    <h3 class="project__title">Project name</h3>
    <p class="project__body">One or two sentences on the problem and what you built.</p>
    <ul class="tags"><li>AWS</li><li>React</li></ul>
    <a class="btn btn--outline" href="https://example.com" target="_blank" rel="noopener noreferrer">View project</a>
  </article>
</div>
```

```css
.projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.project { padding: 28px 24px; background: var(--surface); border: var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
```

## Content that still needs your input

**Ownership framing on employer work is deliberate — do not "tidy" it away.**
The Janitorial Management System is Ranyan's product. John Paul built its
backend as an employee. The card says "Built for Ranyan — my employer", the
panel lists "Owned by: Ranyan", and a dashed note states the platform is not his
product. Those are there on purpose, to avoid implying he owns or sells a system
that belongs to his employer. Keep them if you rewrite the copy.

The project showcase is built from John Paul's own account of the work, not from
the Stitch mockups (which contain invented companies, metrics, dates and an
"AWS Certified" claim — none of that is on the site).

- [ ] **Two descriptive project titles.** *Financial services websites* and
      *Sensor data & dashboards* are deliberately descriptive, because you
      described those as types of work rather than named projects. Replace them
      with real project names, clients and outcomes when you have them.
- [ ] **Tech tags** under *What I do* — React / TypeScript / Node.js / React
      Native / Swift / Kotlin / Lambda / Docker etc. Still guesses based on
      "web, mobile, AWS". Delete anything you don't actually use.
- [ ] **MCP** is left unexpanded in the Janitorial card. If it means Model
      Context Protocol, consider spelling it out; if it means something
      specific to Ranyan, leave it as-is.
- [ ] **Contact email** — currently `johnpaul.g.delmundo@gmail.com`. It appears
      in `index.html` in three places (mailto link, visible `<code>`, and the
      `data-copy` attribute on the copy button). Change all three together.
- [ ] **GitHub URL** — currently `https://github.com/luapearth`. Appears in the
      work section and the contact section.
- [ ] **`<title>` / meta description** — tune for search if you care about it.

## Accessibility notes

Skip link, semantic landmarks, `aria-current` on the active nav item,
`aria-expanded` on the mobile nav toggle, visible focus rings on every
interactive element, Escape-to-close nav, 48px minimum hit targets.

The scroll-reveal animation is opt-in: an inline head script adds `js-reveal` to
`<html>` only when JS is available *and* `prefers-reduced-motion` is not set.
Without that class the CSS never hides content, so nothing is trapped behind an
animation that can't run. The copy-email button falls back to a hidden-textarea
`execCommand` copy when the async clipboard API is missing or refused, and if
both paths fail it selects the visible address and reads "Select & copy" rather
than silently doing nothing.
