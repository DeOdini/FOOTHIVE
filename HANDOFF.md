# FootHive handoff

- **Project:** FootHive landing page
- **Stack:** Static HTML, CSS, and JavaScript; no build step.
- **Hosting:** Netlify production is live at `https://foothive.netlify.app/` and publishes from GitHub `main`.
- **Logo:** `assets/logo/foothive-logo.svg` (dark variant: `assets/logo/foothive-logo-dark.svg`).
- **Products:** `assets/products/` is reserved for approved product images in a later ticket.
- **Preview destinations:** Shop and Instagram currently use `https://pin.it/37MYm0GnG` until the Operator provides final destinations.

Update copy, product imagery, or external destinations only in the agreed project files. Do not add a cart, backend, database, authentication, or extra pages in v1.

## T02 — Global layout & responsive shell

**Status:** Implemented, merged to `main`, deployed, and responsive verification recorded.

- **Repository:** `C:\Users\USER\FOOTHIVE`
- **Merged PR:** [#1](https://github.com/DeOdini/FOOTHIVE/pull/1)
- **Source branch:** `t02/global-layout-responsive-shell`
- **Branch at T02 completion:** `main`
- **Implementation commit:** `1877def` — `T02: build global responsive shell`
- **Merge commit on main:** `1e6beaf`
- **Files:** `index.html`, `css/styles.css`

The shell now has a responsive sticky header with the FootHive logo and Products / Story / Notify / Shop navigation; anchor targets for the later page sections; shared page-width layout; visible keyboard focus styles; and a dark responsive footer with the logo, “BUILT TO LAST,” email, placeholder social and policy links, and 2026 copyright.

T02 deliberately leaves product and story content empty, omits a cart, and adds no real policy routes or feature integrations. The approved Pinterest URL remains the temporary destination for Shop and Instagram. No product images were added.

## T02 — Responsive verification

**Operator verification:** The Operator reports checking desktop and mobile devices and confirming that the responsive presentation is in accordance.

**Independent Codex verification:** Inspected the live Netlify site (`https://foothive.netlify.app/`) in the De O'Dini Chrome profile using the CUA browser and its Playwright-backed tab API at 1440×900 (desktop), 768×1024 (tablet), 390×844 (mobile), and 320×780 (narrow mobile). At each size, the document had no horizontal overflow. Both logo images loaded; the header/navigation and footer adapted to the viewport; and Chrome reported no console warnings or errors. Screenshots were reviewed at desktop, mobile, and narrow mobile widths. The empty center area is intentional at T02; hero, products, story, trust, and notification content belong to later tickets.

**Tools used:** Chrome via CUA browser control; the tab's accessibility snapshot, Playwright-backed read-only page evaluation, viewport override, screenshot, and console-log APIs. The standalone VS Code Playwright MCP was available but was not invoked. No automated test suite was run.

## T03 - Hero section

**Status:** Implemented, committed, and pushed to GitHub; awaiting evaluation.

- **Repository:** `C:\Users\USER\FOOTHIVE`
- **Branch:** `t03/hero-section`
- **Commit:** `6ad260c` - `T03: build hero section`
- **Commit author:** `DeOdini <deodinihq@gmail.com>`
- **Files:** `index.html`, `css/styles.css`

The hero includes the approved headline and support copy, Shop Now linked to `https://pin.it/37MYm0GnG`, Get Notified linked to `#notify`, and the approved free-shipping note. The layout stacks CTAs on mobile and places them in a row on wider screens, with visible keyboard focus and reduced-motion handling. Prices and product images were omitted. The desktop visual is CSS decoration. T03 is not merged, so it is not part of the live Netlify deployment.

**Verification:** `git diff --check` passed before commit. No browser/device QA or automated test suite was run for T03. The branch tracks `origin/t03/hero-section`.
