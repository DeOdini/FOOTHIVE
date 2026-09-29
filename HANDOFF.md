# FootHive handoff

- **Project:** FootHive landing page
- **Stack:** Static HTML, CSS, and JavaScript; no build step.
- **Hosting:** Netlify is the approved static hosting target. Deployment setup is handled in a later ticket.
- **Logo:** `assets/logo/foothive-logo.svg` (dark variant: `assets/logo/foothive-logo-dark.svg`).
- **Products:** `assets/products/` is reserved for approved product images in a later ticket.
- **Preview destinations:** Shop and Instagram currently use `https://pin.it/37MYm0GnG` until the Operator provides final destinations.

Update copy, product imagery, or external destinations only in the agreed project files. Do not add a cart, backend, database, authentication, or extra pages in v1.

## T02 — Global layout & responsive shell

**Status:** Implemented and pushed; awaiting review. This branch has not been merged.

- **Repository:** `C:\Users\USER\FOOTHIVE`
- **Branch:** `t02/global-layout-responsive-shell`
- **Implementation commit:** `1877def` — `T02: build global responsive shell`
- **Files:** `index.html`, `css/styles.css`

The shell now has a responsive sticky header with the FootHive logo and Products / Story / Notify / Shop navigation; anchor targets for the later page sections; shared page-width layout; visible keyboard focus styles; and a dark responsive footer with the logo, “BUILT TO LAST,” email, placeholder social and policy links, and 2026 copyright.

T02 deliberately leaves product and story content empty, omits a cart, and adds no real policy routes or feature integrations. The approved Pinterest URL remains the temporary destination for Shop and Instagram. No product images were added.

**Review checkpoint:** Browser and device QA has not been run. Have T02 evaluated before starting the next ticket. Open the static site from `index.html`; there is no build step. Netlify setup remains a later task.
