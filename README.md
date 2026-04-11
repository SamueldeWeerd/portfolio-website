# Portfolio Website — Samuel de Weerd

Personal portfolio website at [samueldeweerd.nl](https://www.samueldeweerd.nl).

## Why plain HTML, CSS and Bootstrap?

This site is built with static HTML, CSS and Bootstrap 5 — no React, no Next.js, no build step. That's a deliberate choice:

- **Instant rendering.** There's no JavaScript framework hydrating a virtual DOM. The browser receives HTML and renders it immediately. For a portfolio site with no dynamic data, this is the fastest possible approach.
- **No backend needed.** There's nothing to fetch from an API. All content lives in the HTML and two small JSON files for translations. No server, no database, no CMS.
- **Bootstrap 5 is enough.** The grid system, modals and responsive utilities cover everything this site needs. Bootstrap 5 dropped the jQuery dependency, so the entire JS footprint is Bootstrap's bundle (~60KB) plus ~170 lines of vanilla JS.
- **Easy to deploy.** Push to GitHub, served by GitHub Pages. No CI/CD pipeline, no build artifacts, no environment variables.
- **Easy to maintain.** Any developer can open `index.html` and understand the full site in minutes. No component trees, no state management, no dependency hell.

A framework would add complexity without adding value here. The site loads fast, scores well on Lighthouse, and is trivial to update.
