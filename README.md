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
root as a Pages artifact and deploys it.

**One-time manual step** (repo admin, can't be done from code): in the GitHub
repo go to **Settings → Pages → Build and deployment → Source** and select
**GitHub Actions**. Until that is set, the workflow will fail at the deploy
step. The site will then live at `https://luapearth.github.io/portfolio/`.

To use a custom domain instead, add **Settings → Pages → Custom domain** *and*
commit a `CNAME` file at the repo root containing the bare domain.

## Design system

Neubrutalism: flat saturated colour, thick ink borders, hard offset shadows, no
gradients, no blur, no soft elevation.

Tokens live at the top of `styles.css` under `:root` — colour, border width,
shadows, radii, and the three font families. Changing `--ink`, `--yellow`, or
`--bw` there re-skins the whole site.

| Token group | Values |
|---|---|
| Ink / paper | `--ink` `#111111`, `--paper` `#fbf6ea`, `--surface` `#ffffff` |
| Accents | `--yellow` `--cyan` `--pink` `--lime` `--orange` `--violet` |
| Type | Archivo Black (display), Space Grotesk (body), Space Mono (labels) |

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

These were written as plausible stand-ins so the page reads as finished. Check
each before publishing:

- [ ] **Tech tags** under *What I do* — React / TypeScript / Node.js / React
      Native / Swift / Kotlin / Lambda / Docker etc. Delete anything you don't
      actually use; they are guesses based on "web, mobile, AWS".
- [ ] **Contact email** — currently `johnpaul.g.delmundo@gmail.com`. It appears
      in `index.html` in three places (mailto link, visible `<code>`, and the
      `data-copy` attribute on the copy button). Change all three together.
- [ ] **GitHub URL** — currently `https://github.com/luapearth`. Appears in the
      work section and the contact section.
- [ ] **About copy** — deliberately avoids naming employers, clients, or dates.
      Add real specifics when you want them public.
- [ ] **`<title>` / meta description** — tune for search if you care about it.

## Accessibility notes

Skip link, semantic landmarks, `aria-current` on the active nav item,
`aria-expanded` on the mobile nav toggle, visible focus rings on every
interactive element, Escape-to-close nav, 48px minimum hit targets.

The scroll-reveal animation is opt-in: an inline head script adds `js-reveal` to
`<html>` only when JS is available *and* `prefers-reduced-motion` is not set.
Without that class the CSS never hides content, so nothing is trapped behind an
animation that can't run. The copy-email button removes itself if the async
clipboard API is unavailable, rather than sitting there doing nothing.
