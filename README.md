# Script Assist — QA Automation Starter

This project contains automated tests for the Script Assist patient app. It uses
[Playwright](https://playwright.dev/) with TypeScript.

It covers two things:

1. **UI tests** — a real browser clicking through the app: Registration, Login, Logout, Dashboard,
   Profile, Settings, and Task Search.
2. **API tests** — direct HTTP requests against the real staging backend (no browser), covering
   patient registration and login.

This is a **starter framework** — it proves the approach works end-to-end, not a fully complete
test suite. See `docs/test-strategy.md` for what was prioritized first and why, and
`docs/engineering-decisions.md` for the reasoning behind the CI setup and how flaky tests are kept
under control. This README describes how the suite actually works today — if anything in those two
docs seems to disagree with this file, trust this file.

## What's in this repo

```
.
├── docs/
│   ├── test-strategy.md            # Which journeys to automate first, and why
│   └── engineering-decisions.md    # Why the CI/flake-reduction setup looks the way it does
├── fixtures/
│   └── pages.fixture.ts            # Hands tests a ready-made LoginPage via test fixtures
├── src/
│   ├── pages/                      # One class per screen (Page Object Model)
│   │   ├── LoginPage.ts
│   │   ├── RegistrationPage.ts
│   │   ├── DashboardPage.ts
│   │   ├── ProfilePage.ts
│   │   ├── SettingsPage.ts
│   │   └── TaskSearchPage.ts
│   └── utils/
│       ├── api-client.ts           # Reusable, typed API client (AuthApiClient)
│       └── test-data.ts            # Generates unique emails/names so tests don't collide
├── TestData/
│   └── registration.json           # Fixed personal details used to fill in & check the registration form
├── tests/
│   ├── setup/
│   │   └── auth.setup.ts           # Logs in once and saves the session so other tests skip the login step
│   ├── ui/                         # Registration, Login, Logout, Dashboard, Profile, Settings, Task Search
│   └── api/
│       └── auth-api.spec.ts        # Register + login, tested directly over HTTP
├── playwright/.auth/               # Saved login session from auth.setup.ts (not committed to git)
├── .github/workflows/playwright.yml
├── playwright.config.ts
└── package.json
```

A couple of import paths in the tests look like `@pages/LoginPage` or `@utils/test-data` instead of
a relative `../../` path. Those are just shortcuts defined in `tsconfig.json`:

- `@pages/*` → `src/pages/*`
- `@utils/*` → `src/utils/*`
- `@fixtures/*` → `fixtures/*`

You don't need to do anything with these — Playwright and TypeScript resolve them automatically.

> **Housekeeping note — some files here are leftovers, not part of the real suite.**
> `tests/api/Loginapi.spec.ts`, `tests/api/Registrationapi.spec.ts`, `src/utils/PatientApi.ts`, and
> `TestData/ patientData.json` (note the stray leading space in that filename) were early
> experiments. They duplicate what `tests/api/auth-api.spec.ts` + `AuthApiClient` already do
> properly, they have real email addresses and passwords typed directly into the code, and most of
> their checks are commented out. None of them run in CI or via any `npm` script — they're just
> sitting in the repo. Safe to delete once you've confirmed `auth-api.spec.ts` is the one you want
> to keep (see **What I'd improve** at the bottom).

## 1. One-time setup

You'll need **Node.js 18 or newer** installed. Then, from the project folder, run:

```bash
npm install
npx playwright install --with-deps
```

The first command installs the project's dependencies. The second downloads the actual browser
(Chromium, by default) that Playwright drives — this is separate from `npm install` and only needs
to be done once per machine (or whenever Playwright is updated).

### Tell the tests which app and account to use

Create a file named `.env` in the project's root folder (the same folder as `package.json`). This
file is ignored by git, so it's safe to put real values in it — it never gets committed.

```bash
BASE_URL=https://your-staging-app.example.com/login
API_BASE_URL=https://your-staging-api.example.com
USER_EMAIL=a-real-seeded-patient@example.com
USER_PASSWORD=the-seeded-patient-password
```

What each of these means:

- `BASE_URL` — the web address of the app the UI tests should open in the browser.
- `API_BASE_URL` — the web address of the backend API the API tests should call directly.
- `USER_EMAIL` / `USER_PASSWORD` — login details for a **real, already-existing** patient account
  on that environment. Nearly every test needs to start from a logged-in state, so this account has
  to actually exist and work — the tests don't create it for you.

If you're running these tests in a CI pipeline rather than on your own machine, put these four
values into your CI provider's secrets/variables settings instead of a committed `.env` file.

## 2. Running the tests

Once setup is done, here's what you can run:

```bash
npm test                # Run everything — UI tests and API tests
npm run test:ui         # Only the UI (browser) tests
npm run test:api        # Only the API tests
npm run test:smoke      # Only the small "is it broken" set of tests, tagged @smoke
npm run test:sanity     # Only the tests tagged @sanity
npm run test:headed     # Same as test:ui, but you can actually watch the browser open and click around
npm run test:debug      # Opens Playwright's step-through debugger, one action at a time
npm run report          # Opens an HTML report of the most recent run in your browser
```

If you're new to this: start with `npm run test:headed` once, so you can watch a real browser go
through the app and see what the tests are actually doing.

### Pointing at a different environment

You don't need to edit any files to test a different environment — just override the values for
that one command:

```bash
BASE_URL=https://your-env.example.com API_BASE_URL=https://your-api.example.com npm test
```

## 3. How logging in works

You won't find a `login()` call inside every single test — that's intentional, and it's the part
most likely to look surprising the first time you read the code.

Before any UI test runs, a special "setup" step (`tests/setup/auth.setup.ts`) logs in once using
the account from your `.env` file, and saves that logged-in browser session to a file
(`playwright/.auth/patient.json`). Every other UI test then just loads that saved session instead
of typing in a username and password again. This is configured in `playwright.config.ts`. It's
faster and it means a login bug only breaks one place instead of every single test.

The **Login** and **Logout** tests are the exception — they need to start from a logged-*out*
state on purpose, so they explicitly opt out of the saved session with
`test.use({ storageState: { cookies: [], origins: [] } })` at the top of the file.

## 4. Where test data comes from

- `src/utils/test-data.ts` — generates a fresh, unique email and name (based on the current
  timestamp) every time it's called. This means you can re-run the registration test against the
  same shared environment as many times as you like without it failing because "this email is
  already registered."
- `TestData/registration.json` — a fixed set of personal details (name, phone number, date of
  birth, password) used to fill in the registration form and to double-check the profile page
  afterwards. Only the email address is generated fresh each run; everything else stays the same.

## 5. What happens in CI

`.github/workflows/playwright.yml` runs automatically on every pull request and every push to
`main`, plus once a night on a schedule. It's split into three jobs:

1. **api-tests** — runs first, since it's fast and doesn't need a browser.
2. **ui-smoke** — on pull requests only. Runs just the UI tests tagged `@smoke`, so you get a quick
   signal without waiting for the full suite.
3. **ui-full-regression** — on pushes to `main` and the nightly run. Runs every UI test.

Whether a job passes or fails, it uploads its HTML report as a downloadable build artifact, so you
can open it and see exactly what happened.

## 6. Checking your own results

After running tests locally, two folders get created: `playwright-report/` and `test-results/`.
Neither is committed to git (both are in `.gitignore`) — they're regenerated every time you run the
suite. Run `npm run report` to open the latest one in your browser. It includes a full trace for
any test that failed or was retried, which you can step through action-by-action.

You can also run `npx tsc --noEmit` at any time to type-check the whole project (every page object
and every test) without actually running anything — useful as a quick sanity check after editing
code.

## Assumptions worth knowing about

- **Selectors**: the page object classes (`src/pages/*.ts`) use resilient, human-readable locators
  like `getByRole` and `getByLabel`, with a `data-testid` fallback where needed. These were checked
  against the real staging app. If the app's UI changes and a locator breaks, you only need to fix
  it in one place — the relevant file in `src/pages/`.
- **The seeded test account**: login and every test that needs to be signed in depend on one real,
  pre-existing account (`USER_EMAIL` / `USER_PASSWORD`). In a more mature setup, this account would
  come from an automated test-data service rather than being typed into a local `.env` file by
  hand.
- **The API tests hit the real backend**: `tests/api/auth-api.spec.ts` calls the actual staging
  API (`API_BASE_URL`) with real request payloads — it is not testing against a mock or a stub.
- **Registration tests are safe to re-run**: because `test-data.ts` generates a brand-new email
  address every time, you can run the registration suite over and over against the same shared
  staging environment without old test accounts causing failures.

## What I'd improve with more time

- Delete the leftover/duplicate API files called out in the housekeeping note above
  (`Loginapi.spec.ts`, `Registrationapi.spec.ts`, `PatientApi.ts`, `TestData/ patientData.json`) so
  `auth-api.spec.ts` + `AuthApiClient` is the one obvious place for API coverage.
- Remove the real names/emails typed directly into those same leftover files, since none of that
  should live in committed code either way.
- Add a proper way to create and clean up test accounts (through the API) instead of slowly
  accumulating throwaway patient accounts on the shared staging environment.
- Add accessibility checks (e.g. with axe-core) on the main screens, as their own clearly-labelled
  suite.
- Add a visual regression baseline once the UI stops changing so often.
- Once the Chromium suite is proven stable, run it nightly against Firefox, WebKit, and a mobile
  viewport too.
