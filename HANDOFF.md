# FootHive handoff

- **Project:** FootHive landing page
- **Stack:** Static HTML, CSS, and JavaScript; no build step.
- **Hosting:** Netlify production is live at `https://foothive.netlify.app/` and publishes from GitHub `main`.
- **Logo:** `assets/logo/foothive-logo.svg` (dark variant: `assets/logo/foothive-logo-dark.svg`).
- **Products:** T04 currently uses seven selected product images in `assets/products/`; see the T04 section for filenames and replacement steps.
- **Preview destinations:** Shop and Instagram currently use `https://pin.it/37MYm0GnG` until the Operator provides final destinations.

Update copy, product imagery, or external destinations only in the agreed project files. Do not add a cart, backend, database, authentication, or extra pages in v1.

## T02 � Global layout & responsive shell

**Status:** Implemented, merged to `main`, deployed, and responsive verification recorded.

- **Repository:** `C:\Users\USER\FOOTHIVE`
- **Merged PR:** [#1](https://github.com/DeOdini/FOOTHIVE/pull/1)
- **Source branch:** `t02/global-layout-responsive-shell`
- **Branch at T02 completion:** `main`
- **Implementation commit:** `1877def` � `T02: build global responsive shell`
- **Merge commit on main:** `1e6beaf`
- **Files:** `index.html`, `css/styles.css`

The shell now has a responsive sticky header with the FootHive logo and Products / Story / Notify / Shop navigation; anchor targets for the later page sections; shared page-width layout; visible keyboard focus styles; and a dark responsive footer with the logo, �BUILT TO LAST,� email, placeholder social and policy links, and 2026 copyright.

T02 deliberately leaves product and story content empty, omits a cart, and adds no real policy routes or feature integrations. The approved Pinterest URL remains the temporary destination for Shop and Instagram. No product images were added.

## T02 � Responsive verification

**Operator verification:** The Operator reports checking desktop and mobile devices and confirming that the responsive presentation is in accordance.

**Independent Codex verification:** Inspected the live Netlify site (`https://foothive.netlify.app/`) in the De O'Dini Chrome profile using the CUA browser and its Playwright-backed tab API at 1440�900 (desktop), 768�1024 (tablet), 390�844 (mobile), and 320�780 (narrow mobile). At each size, the document had no horizontal overflow. Both logo images loaded; the header/navigation and footer adapted to the viewport; and Chrome reported no console warnings or errors. Screenshots were reviewed at desktop, mobile, and narrow mobile widths. The empty center area is intentional at T02; hero, products, story, trust, and notification content belong to later tickets.

**Tools used:** Chrome via CUA browser control; the tab's accessibility snapshot, Playwright-backed read-only page evaluation, viewport override, screenshot, and console-log APIs. The standalone VS Code Playwright MCP was available but was not invoked. No automated test suite was run.

## T03 - Hero section

**Status:** Implemented and merged to `main` via [PR #2](https://github.com/DeOdini/FOOTHIVE/pull/2).

- **Repository:** `C:\Users\USER\FOOTHIVE`
- **Source branch (deleted after merge):** `t03/hero-section`
- **Implementation commit:** `6ad260c` - `T03: build hero section`
- **Merge commit:** `429c57e` - `Merge T03 hero section`
- **Commit author:** `DeOdini <deodinihq@gmail.com>`
- **Files:** `index.html`, `css/styles.css`

The hero includes the approved headline and support copy, Shop Now linked to `https://pin.it/37MYm0GnG`, Get Notified linked to `#notify`, and the approved free-shipping note. The layout stacks CTAs on mobile and places them in a row on wider screens, with visible keyboard focus and reduced-motion handling. Prices and product images were omitted. The desktop visual is CSS decoration. T03 is merged to `main`; production deployment status after the merge was not checked when this handoff was updated.

**Verification:** `git diff --check` passed before commit. No browser/device QA or automated test suite was run for T03. The merged T03 feature branch was deleted from GitHub and locally after merge.

## T04 - Product grid (6-12 mixed)

**Status:** Implemented, committed, pushed, and merged to GitHub `main` via [PR #3](https://github.com/DeOdini/FOOTHIVE/pull/3). Merge commit: `0224b26dfa8e89b1c1c0c148fc30eede050ea358`. Prices are omitted.

- **Products:** 7 cards: 3 boots, 2 classic shoes, and 2 runners.
- **Images:** `assets/products/olive-canvas-buckle-boot-front.png`, `ivory-shaft-western-boot.png`, `crimson-triple-buckle-boot.png`, `olive-suede-wingtip-brogue.png`, `burnished-cognac-patina-oxford.png`, `frost-glow-sock-runner.png`, and `talon-blade-runner.png`.
- **Links:** Each image and Shop link points to the approved Pinterest trial destination, `https://pin.it/37MYm0GnG`.
- **Asset exclusions:** No image listed in `FAILED_FH_BRAINBOX.md` was used. The SECURITY-marked tactical footwear image was also excluded.

To replace a card, place the replacement image in `assets/products/` and update that card's image `src`, descriptive `alt`, product heading, category, and corner tag in `index.html`. Duplicate an existing `<article class="product-card">` to add an item; keep the total between 6 and 12 and maintain category variety. Prices remain omitted. The Pinterest link remains the shared trial destination.

**Post-merge verification:** The deployed Netlify URL was blocked by Netlify Team Protection during the current QA pass, so the merged T04 implementation was verified locally from `main` using a temporary static server. At 1440x900 the grid rendered in three columns; at 768x1024 it rendered in two; at 390x844 and 320x780 it rendered in one. All seven product images loaded, each image used the expected 4:5 media box, no horizontal overflow was observed, the hero CTAs were visible and usable, all product links used the approved Pinterest placeholder, and the mobile navigation and footer remained visible. One console error remains: the local page requests `/favicon.ico`, which returns 404. No automated test suite was run. Verdict: **IMPLEMENTATION PASS - RESPONSIVE VERIFICATION PENDING** until the favicon console error is resolved or explicitly accepted.

## T05 - Story / brand block

**Status:** Implemented and merged to `main` through PR #4. The T05 implementation commit is `f7e195b`; the merge commit is `df42c83`.

- **Repository:** `C:\Users\USER\FOOTHIVE`
- **Source branch:** `t05/story-brand-block`
- **Base:** T04 merge `0224b26`
- **Files:** `index.html`, `css/styles.css`

The story section now sits between Products and Trust with the approved Direction B attitude: `Built different. Made to last.` It includes PRD-safe brand-positioning copy, an optional `Shop the collection` link using the temporary Pinterest destination, semantic `h2` structure, and mobile-first responsive styling. No trust content, notify form, analytics, cart, backend, extra pages, or new dependencies were introduced.

Focused local browser validation confirmed the story section at desktop and mobile sizes, no horizontal overflow, correct section labelling, responsive layout, and the approved Shop placeholder. The Operator was also able to confirm the responsive state of the T05 website. The existing favicon 404 remains the only console error and is out of scope by Operator decision. Final copy approval remains a separate review gate.

## Current overall report and Copilot handoff � 2026-09-29

### Overall project state

T01�T05 are implemented. T02, T03, T04, and T05 are merged to GitHub `main`; T05 was merged through PR #4 at `df42c83`. T04 was merged through [PR #3](https://github.com/DeOdini/FOOTHIVE/pull/3), merge commit `0224b26dfa8e89b1c1c0c148fc30eede050ea358`.

- **T01 � Project shell and design tokens:** Claude's evaluation is recorded as a pass.
- **T02 � Global layout and responsive shell:** Merged through PR #1. The Operator and Codex report responsive verification at desktop, tablet, mobile, and narrow mobile sizes, with no horizontal overflow reported.
- **T03 � Hero section:** Merged through PR #2. Structural checks passed; no separate T03 browser/device QA is recorded.
- **T04 � Product grid:** Seven cards (three boots, two classic shoes, two runners), using selected local images. Prices are omitted and flagged images were excluded.
- **T05 � Story / brand block:** Implemented and merged to `main`; focused rendering checks and the Operator's responsive confirmation are recorded above. Final copy approval remains pending.

The deployed page DOM was observed to contain the T04 hero and all seven product cards. Local merged-branch viewport verification then confirmed the 3/2/1 grid progression, seven loaded images, consistent 4:5 image boxes, no horizontal overflow, usable hero and product links, and visible mobile navigation/footer behavior. The public Netlify URL was blocked by Team Protection during this pass. The only local console error was a missing `/favicon.ico`, so the T04 verdict remains **IMPLEMENTATION PASS - RESPONSIVE VERIFICATION PENDING**.

### Instructions for Copilot

Continue the Foothive static landing page in `C:\Users\USER\FOOTHIVE`. T04 is merged remotely via PR #3 (`0224b26dfa8e89b1c1c0c148fc30eede050ea358`) and T05 is merged via PR #4 (`df42c83`). Preserve any documentation updates before switching branches. Read this handoff and the approved next ticket before implementing anything.

Keep the MVP scope: static site, no prices, cart, backend, database, authentication, or extra pages unless the approved ticket explicitly calls for them. Pinterest remains the temporary Shop/Instagram destination. Do not use images listed in `FAILED_FH_BRAINBOX.md`. The favicon console error is out of scope by Operator decision. Before T06, record final copy approval or any requested copy changes.

## T06 - Trust section responsive QA

**Status:** Operator confirmed responsive QA across desktop, tablet, and mobile devices.

## T07 - Get Notified form

**Status:** Implemented on `t07/get-notified-form`; Operator confirmed live end-to-end verification with two responses received.

- **Form action:** `https://docs.google.com/forms/d/e/1FAIpQLSe5QM7xc1tT8DSJD2Ryiirh4_mfuMQGnLUxte0mzVf-Gxh_PA/formResponse`
- **Email address question mapping:** HTML field key `entry.1045781291` (confirmed correct by Operator).
- **Scope:** Email only; no name, address, CAPTCHA, backend, or mailing-list provider.

The inline FootHive form submits to Google Form/Sheet through a hidden iframe target, so visitors remain on the FootHive page. It includes an accessible email label, required email validation, consent copy, inline error/status messaging, and a success state. The Google Form interface is not displayed on the website, and no submitted email is stored in the repository.

Focused validation confirmed the endpoint, entry ID, invalid-email error state, mobile stacking, desktop inline controls, and no horizontal overflow. During that focused Codex validation, no real email was submitted. The Operator later confirmed that two live submissions appeared in Google Forms responses. The existing favicon 404 remains out of scope by Operator decision.
## T08 - GA4 hook

**Status:** Implemented and merged into `main` via PR #7; Operator confirmed live end-to-end verification.
**Base:** T07 commit `aff08ed` (`t07/get-notified-form`)
**Measurement ID:** `G-8WM4JZKBNR` in `js/analytics.js`

The site loads `js/analytics.js` once from the `<head>` of `index.html`. The script holds the Measurement ID in one configuration variable, skips initialization if the ID is the placeholder `G-XXXXXXXXXX`, and uses a window guard to avoid duplicate initialization. With the supplied ID, it initializes Google’s `gtag.js` and enables the standard `page_view` event. No notify-form email, consent text, or other form values are sent as analytics event parameters; no custom form events are configured.

The Measurement ID is a public identifier, not a secret. This static site does not read `.env` files, so the ID is configured directly in `js/analytics.js`. No new dependencies, backend, SEO changes, or layout changes were added for T08.

## T09 - SEO, semantics, and accessibility

**Status:** Implemented, committed, and pushed.  
**Branch:** `t09/seo-semantics-accessibility`
**Commit:** `f9c1033433a70bde5ab79f12a5339535d716fdb6` - `T08: add SEO and accessibility refinements`  
**Parent:** `aff08edda364866f26b06c97c57c9af7dc6e7567` - T07 Get Notified form

### Changes

- Preserved Copilot's Open Graph metadata and reduced-motion CSS.
- Added canonical URL, Open Graph site name and URL, Twitter summary-card metadata, and theme color.
- Added intrinsic dimensions to all seven product images and both logos.
- Added an accessible name to the notification form and disabled autocapitalization and spellcheck for its email field.
- Retained the existing semantic landmarks, heading hierarchy, alt text, skip link, visible focus states, and live form status.
- Favicon remains deferred by Operator decision. No GA4 code was added as part of the T09 SEO implementation.

### Responsive verification

Tested the local SEO/accessibility working tree in Chrome (De O'DINI profile) using CUA browser controls, viewport overrides, Playwright-backed read-only page evaluation, and screenshots. The temporary static server at `127.0.0.1:4175` was stopped after testing, and Chrome's viewport was reset.

| Viewport | Product grid | Overflow | Visual review |
|---|---|---|---|
| 1440x900 desktop | 3 columns | None | Reviewed |
| 768x1024 tablet | 2 columns | None | Reviewed |
| 390x844 mobile | 1 column | None | Reviewed |

All seven product images and both logos loaded after scrolling through the mobile page. No warning/error entries were returned by the current browser console-log API. Copilot's earlier preview log showed the deferred `/favicon.ico` 404. No Safari, Firefox, or Edge test, and no automated accessibility audit, was run.

### Ticket mapping note

Ticket correction: this SEO/semantics/accessibility implementation is T09 work, originally committed on a branch named `t08/seo-semantics-accessibility` due to the recorded ticket-role mismatch. The implementation remains unchanged and is reclassified as T09. The authorized T08 GA4 hook was implemented on `t08/ga4-hook` from T07 and merged into `main` via PR #7.

## Header follow-up — PR #6 comparison

The current header logo markup now matches PR #6 (`aff08ed`) exactly: no explicit `width` or `height` attributes. The scoped `.brand img { height: auto; }` rule keeps the logo at its natural aspect ratio and is also applied to the footer logo. Localhost browser verification at a 1225 px viewport measured the header at 95.3 px and the logo at 192 × 60 px. No Netlify deployment was used.

## Operator decision — logo dimensions

Operator reviewed the local and deploy-preview screenshots and approved omitting explicit intrinsic `width`/`height` attributes from the header and footer logos. The deploy-preview screenshot shows substantially more vertical space around the header/footer than the localhost version; the visible logo artwork is not itself larger. Keep `.brand img { height: auto; }` and the PR #6 logo markup. T09 dimensions remain on the product images.
## T11 — Cross-browser responsive QA

**Branch:** `t11/cross-browser-responsive-qa` (stacked on T10; integrate T09 → T10 → T11).
**Preview:** `http://localhost:4173/` (local only; no Netlify deploy used).
**Outcome:** Pass across Chrome 154.0.8037.58 and Microsoft Edge 154.0.4258.37 at 320×780, 390×844, 768×1024, and 1440×900. No horizontal overflow; hero copy and CTAs stay within the viewport; product grid responds as 1/1/2/3 columns; notify controls remain usable. No T11 source changes were required.

At 320 px, empty-email validation showed the expected inline error in both browsers without navigation or submission. No valid address was sent during this QA pass. The Operator’s earlier live verification of two Google Forms responses remains the success-path evidence. Firefox was unavailable and Safari is unavailable on this Windows machine. The existing favicon 404 remains deferred by Operator decision.

### T11 Edge screenshots

- 320×780: [edge-320x780.png](docs/qa/t11/edge-320x780.png)
- 390×844: [edge-390x844.png](docs/qa/t11/edge-390x844.png)
- 768×1024: [edge-768x1024.png](docs/qa/t11/edge-768x1024.png)
- 1440×900: [edge-1440x900.png](docs/qa/t11/edge-1440x900.png)

The same captures and full viewport matrix are recorded in the Brainbox build report under **T11 — Cross-browser and responsive QA**. These repository copies keep the evidence available with the T11 handoff.
## T12 — Operator maintenance and deploy readiness

This is a static site. `index.html` is the entry point at the repository root; CSS, JavaScript, and product images are loaded from relative paths. There is no package manifest, dependency install, or build command. Keep the site at the publish root when deploying to Netlify.

### Replace a product

1. Add the approved image to `assets/products/` using a descriptive, lowercase filename. Check `FAILED_FH_BRAINBOX.md` before selecting imagery; do not use any flagged image.
2. In `index.html`, find the matching `<article class="product-card">` in `.product-grid`.
3. Update the image `src` and descriptive `alt`, product heading, category, and corner tag together. Keep the image links and Shop links pointed at the intended product destination.
4. To add a product, duplicate one complete product-card article; to remove one, remove the complete article. Keep 6–12 products and a mix of boots, classic shoes, and runners. Prices remain omitted.
5. Check that each local image path resolves and review the card at mobile and desktop widths.

### Replace trial links with final destinations

Shop and social links currently use the trial Pinterest URL `https://pin.it/37MYm0GnG`. When the Operator supplies final URLs, edit the relevant `href` values in `index.html`:

- Set Shop navigation, hero, product-card, story, and store links to the appropriate Shopify destination. Use product-specific Shopify URLs on individual product cards when available; use the collection/store URL for general Shop links.
- Replace only the footer Instagram link with the final Instagram profile URL.
- Search `index.html` for `pin.it/37MYm0GnG` to find every remaining trial destination. Review each occurrence before changing it; do not blindly use one URL for Shopify and Instagram.
- Until final destinations are supplied, keep the approved Pinterest trial links. Do not invent or scrape a Shopify store URL.

### Notification form endpoint and field

The notification form is in `index.html`. Its current Google Forms action is `https://docs.google.com/forms/d/e/1FAIpQLSe5QM7xc1tT8DSJD2Ryiirh4_mfuMQGnLUxte0mzVf-Gxh_PA/formResponse`, and the email input uses `name="entry.1045781291"`. The Operator confirmed this mapping and two successful live responses. If the Operator replaces the Google Form, update both the form `action` and the email field's `name` using the new form's published prefilled-entry mapping. Keep the email-only collection and existing validation/status behavior. The linked response Sheet is managed by the Operator; no email submissions or private response data belong in this repository.

### GA4 Measurement ID

The single configuration is `measurementId` in `js/analytics.js`, currently `G-8WM4JZKBNR`. If the analytics property changes, replace that value with the new `G-...` Measurement ID. It is a public identifier, not a secret; this static site does not load `.env`. The script skips the placeholder `G-XXXXXXXXXX`, prevents duplicate initialization, and sends the standard page view only. Do not add form values or email addresses to analytics events.

### Preview and deployment

For a local HTTP preview, serve the repository root and open `http://localhost:4173/`; the Operator's existing preview server is already running. The page can also be opened from the root `index.html` for a basic visual check, though use an HTTP preview to confirm external form/analytics behavior and relative asset loading.

Netlify is configured to publish the repository root from GitHub `main` (per the recorded project setup); no build command or publish subdirectory is needed. Do not deploy a feature branch. T12 readiness was checked locally; no Netlify deploy or production refresh was triggered, preserving the Operator's remaining deploy credit. Before a future release, merge the reviewed ticket stack to `main`, then let the existing main-branch deployment publish the root `index.html` and verify the resulting production page.

**T12 readiness result:** `index.html` and the referenced site assets are at the repository root and served successfully by the existing localhost preview. Netlify's current dashboard settings and a new production deployment were not rechecked in this ticket.

## T13 — Trial disclosure, policy placeholders, and favicon

**Branch:** `t13/trial-disclosure-policy-placeholders` (based on T12 `6c70342`).
**Implementation commit:** `db51afd` — `T13: add trial disclosure, policy dialogs, and favicon` (pushed to GitHub).

The single-page site now has a visible DEODINI workflow-trial note and native privacy and store-information dialogs. The privacy notice explains the page-view-only GA4 use and that any form address is sent to the Operator-managed Google Form for workflow testing; it tells visitors not to submit personal email and gives a contact link for a data-removal request. The form copy no longer promises a live subscription or unsubscribe flow. The shipping claim is now expressly illustrative, and the returns/shipping dialog says there is no operating store, active offer, order fulfillment, or commercial policy. The Pinterest reference destination is disclosed without fabricating a Shopify store.

The existing-logo hexagon mark is available as `assets/logo/favicon.svg` and is linked from the document head. Dialogs use native `<dialog>` behavior, labelled headings, close buttons, backdrop click, and Escape-to-close. No extra page or dependency was added.

**Local verification:** Chrome preview at `http://localhost:4173/` showed both dialogs and their content. The privacy dialog close button restored focus; Escape closed the store dialog. The page had no horizontal overflow at the 1210 px browser viewport. The favicon SVG was opened directly and rendered locally; the root, favicon SVG, stylesheet, and main script returned HTTP 200. No form was submitted, and no email data was transmitted during QA. No Netlify deploy was performed.
## T14 — Notification form hardening and T07 history correction

**Branch:** `t14/form-hardening-t07-record`, based on the pushed T13 branch.
**Form implementation commit:** `2788a22` — `T14: clarify Google Forms response state` (pushed to GitHub).

### Form behavior

The confirmed Google Forms field mapping remains `entry.1045781291`; do not change it based on the earlier ambiguous diagnosis. Invalid input continues to show an inline error and focus the email field. A valid request disables the button while the hidden iframe is pending. If no iframe response is observed within 15 seconds, the page shows a timeout/error message, re-enables the button, and retains the entered value. If the Google Forms response page loads, the page reports that the request reached a response page but cannot verify that Google stored it. The address is not cleared and the page no longer claims “You're on the list.” This is the limit of confirmation available to a static page posting cross-origin to Google Forms; no backend was added.

### T07 historical correction

The original historical wording remains preserved in the Brainbox Build Report. The timestamped correction beside it records the Operator's clarification: the field mapping `entry.1045781291` was correct; the earlier root-cause wording was misread; the material issue was that Netlify was private/unpublished; and Google Forms “Collect email addresses” was temporarily enabled during debugging and turned off after the site was made public. The Operator confirmed two responses from the final known-good setup. Do not reinterpret this correction as a field-mapping change.

**Local verification:** Invalid input `not-an-email` showed the inline error, focused the field, and did not navigate/submit. With the Operator's approval, one disposable address (`t14-test@example.com`) was submitted to the configured Google Form. The hidden iframe loaded the Google response page, while the site displayed its intentionally non-confirmatory status because a static page cannot inspect Google's cross-origin storage result. On 1 October 2026, the Operator inspected the Google Forms Responses tab and confirmed four responses, including `t14-test@example.com`; this confirms that the test response was received and recorded. The Operator later supplied Screenshot (15).png at C:\Users\USER\OneDrive\Pictures\Screenshots\Screenshot (15).png; it shows four responses including the test address. The image also displays other respondents' email addresses, so it is not copied into the repository; those addresses remain omitted from this handoff. No personal email was used and the test response was not deleted. No Netlify deploy was performed.

## T15 - Trial-safe external destinations and social/commerce semantics

**Branch:** `t15/external-links-trial-semantics` (based on the completed T14 branch).
**Implementation commit:** d03dbaa - T15: clarify trial external destinations (pushed to GitHub).

Pinterest-bound links now identify Pinterest in their visible labels and accessible names. The previous footer link labeled Instagram is now labeled Pinterest footwear references. Product links identify each shoe as a Pinterest reference, while the hero, story, trust, navigation, and footer links state that they open Pinterest. The trust content now describes Pinterest as this workflow trial's footwear reference and states that FootHive has no live store. The T13 store-information dialog continues to explain that Pinterest is a reference destination and no FootHive Shopify store is connected.

**Local checks:** The existing preview at `http://localhost:4173/` returned HTTP 200 for the page and stylesheet. Static checks found 20 new-tab external links, all using the approved Pinterest URL and `rel="noopener noreferrer"`; all seven product-image links have product-specific Pinterest accessible names; no Instagram label or misleading store claim remains. No external link was opened and no Netlify deployment was used. A follow-up Playwright CLI browser pass during T16 verified the local T15 page at 320x780, 390x844, 768x1024, and 1440x900: the grid rendered 1/1/2/3 columns with no horizontal overflow, and all 20 outbound links retained Pinterest labels and new-tab descriptions.

**Scope:** No real Instagram or Shopify account was invented; no destination URL, product, price, or backend was added.
## T16 - Accessibility, semantic, and interaction remediation

**Branch:** t16/accessibility-interaction-remediation
**Base:** completed T15 tip 20c1ae6.
**Implementation commit:** 1cab936; handoff formatting correction commit: e24ac0c (both pushed).

### Changes

- Added a shared visually hidden description, “Opens in a new tab,” and referenced it from all 20 outbound links so keyboard and screen-reader users are informed about the context change.
- Changed the skip link's visible keyboard state from :focus to :focus-visible.
- Kept the existing native modal dialogs, semantic headings/landmarks, form label and live status, visible focus styling, reduced-motion rules, and the documented 7rem section scroll margin.

### Verification

git diff --check passed. Automated source checks found 0 duplicate IDs, 0 broken internal anchors, 20/20 outbound links with Pinterest names, safe rel values and new-tab descriptions, one labeled email input, valid accessible dialog titles, alt text on all 9 images, dimensions on all 7 product images, and the skip-link/reduced-motion rules. The existing local preview returned HTTP 200 for the root page and stylesheet.

Playwright CLI (@playwright/cli 0.1.22) verified localhost at 320x780, 390x844, 768x1024, and 1440x900: there was no horizontal overflow and the product grid used 1/1/2/3 columns. Keyboard checks confirmed the first Tab focuses and reveals the skip link; Enter opens the privacy dialog; Escape closes it and restores focus to its trigger. The hero Pinterest link exposed the description “Opens in a new tab” and safe rel values. Earlier T13 browser QA also verified Escape-to-close for the store dialog. The CUA connector itself remained unavailable. No screen-reader test or formal WCAG conformance claim is made; no external link or Netlify deployment was used.