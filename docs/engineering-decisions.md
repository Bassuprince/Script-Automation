# Part D — Engineering Decisions

## Why did you structure your framework this way?

- **Page Object Model** — one class per screen (`LoginPage`, `RegistrationPage`, `DashboardPage`,
  `ProfilePage`, `SettingsPage`, `TaskSearchPage`), sharing a `BasePage`. UI changes only need one file
  fixed, not every test.
- **Tests read like user stories.** Specs say *what* the user does; the page objects handle *how*.
- **Login once, reuse everywhere.** `tests/setup/auth.setup.ts` logs in once and saves the session
  (`storageState`), so every UI test starts already logged in.
- **Fresh test data every run.** `src/utils/test-data.ts` generates unique emails/names, so tests can
  re-run without "already registered" errors.
- **API tests are separate from UI tests.** `src/utils/api-client.ts` calls the API directly, no
  browser needed — faster, and reusable for setting up data.
- **Environment-driven config.** `playwright.config.ts` reads the app/API URLs from env vars, so no
  code changes are needed to switch environments.

## How would you reduce flaky tests?

- Use **role/label/test-ID locators**, not CSS classes or text that can change.
- Rely on **Playwright's auto-waiting** (`toBeVisible`, `toHaveURL`); avoid fixed `waitForTimeout`.
- Give **every test its own data**, so parallel tests don't collide.
- **Retry only at the CI level**; a test needing a retry locally is a bug to fix, not to hide.
- **Wait for the real condition** (e.g. an API call finishing), not a guessed delay.
- **Capture traces/screenshots/video on failure** by default, so failures are debuggable without
  reproducing them.
- **Keep tests independent** — no test should rely on state left behind by another.

## If this project grew to 500 tests, what would you improve first?

1. **Parallelize with sharding**, so runtime doesn't grow with test count.
2. **Tag tests** (`@smoke`, `@regression`, `@api`, `@slow`) to run the right subset per pipeline.
3. **Proper test-data lifecycle** (API-based setup/teardown) instead of just unique emails.
4. **Track flaky tests over time** so they get fixed or quarantined, not ignored.
5. **Push more setup to the API**, keeping UI tests focused on UI behaviour.
6. **Move some coverage to faster layers** — component tests, contract tests — instead of full E2E.
7. **Add codebase rules** — linting, enforced Page Object usage, code review for new tests.

## How would you execute these tests in CI/CD?

- **Smoke suite on pull requests**, full regression on merge to `main` and nightly (already set up in
  `.github/workflows/playwright.yml`).
- **Official Playwright Docker image/action**, so browser versions stay fixed and reproducible.
- **Parallelize** via Playwright sharding across CI jobs.
- **Upload HTML report, traces, and video as CI artifacts** on every failure.
- **Run API tests first**, in their own stage — fast, no browser needed.
- **Smoke failures block the pipeline**; regression failures can notify without blocking, depending on
  team risk appetite.
