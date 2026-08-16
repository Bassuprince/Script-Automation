# Part A — Test Strategy

## 1. Which user journeys would I automate first, and why?

Priority order, based on business risk (blocks a core workflow) × frequency of use × likelihood of regression:

1. **Login / Logout** — Gatekeeper for every other journey. If it breaks, nothing downstream is testable and no
   user can use the product. Highest ROI, smallest surface area, most stable UI (rarely redesigned).
2. **Registration** — Primary acquisition funnel. High business impact if broken (lost signups), and it is a
   multi-field form, so it is prone to validation regressions.
3. **Dashboard** — First authenticated screen; proves session/auth state, routing guards, and key widgets load.
   Acts as a good "is the app alive after login" signal.
4. **Profile** — Read/update of user data; exercises forms + persistence, a common regression area.
5. **Settings** — Lower traffic than the above but still exercises persistence and permission-gated UI; good
   candidate once the core funnel is stable.

Rationale: I automate **journeys that gate other journeys first** (auth), then **revenue/acquisition-critical**
flows (registration), then **high-traffic authenticated** flows (dashboard), then **data-mutation** flows
(profile/settings). This mirrors real usage funnels and gives the fastest feedback on the things that would hurt
most if they broke silently.

## 2. Which scenarios would I include in a Smoke suite?

A smoke suite should be short (< 5 minutes), deterministic, and answer "is the build fundamentally usable?":

- Successful registration with valid data (proves the signup pipeline end-to-end)
- Successful login with valid credentials (proves auth works)
- Login rejected with invalid credentials (proves auth isn't fail-open — a security-relevant smoke check)
- Dashboard loads and shows authenticated content after login (proves session persistence/routing)
- Logout clears the session and returns to a logged-out state (proves session teardown, protects against
  session-fixation style bugs reappearing)

Everything else (profile edit, settings toggles, edge-case validation, negative paths beyond the one above) is
regression-suite territory, not smoke.

## 3. What would I intentionally NOT automate at this stage?

- **Exhaustive field-level validation** (every combination of invalid email/password/length rules) — better
  covered by a handful of unit/component tests near the code, not slow E2E browser tests.
- **Visual/pixel-perfect UI regression** — needs a dedicated visual-regression tool (e.g. Percy/Playwright's
  screenshot diffing) and a stable baseline; premature before the app UI has settled.
- **Third-party integrations** (email delivery for verification links, payment gateways, SMS/OTP) — these need
  contract tests or stubs, not live E2E calls, to avoid flakiness and cost.
- **Performance/load testing** — different tool class (k6/JMeter), different cadence, out of scope for a
  functional Playwright suite.
- **Cross-browser/cross-device matrix** — start with Chromium only for fast feedback; expand to
  Firefox/WebKit/mobile viewports once the core suite is green and stable, then run the wider matrix on a
  slower nightly cadence rather than every PR.
- **Accessibility (a11y) audits** — worth adding (axe-core + Playwright) but as a separate, clearly-labelled
  suite so a11y regressions don't block functional CI runs prematurely.
- **Deep settings permutations** (every toggle × every role) — start with one or two representative settings
  changes; expand only if settings becomes a frequent source of bugs.

The guiding principle: automate what protects revenue/trust-critical paths and what regresses often; leave
long-tail, low-frequency, or better-tested-elsewhere scenarios for later or for a different tool.
