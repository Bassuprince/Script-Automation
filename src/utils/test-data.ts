/**
 * Generates unique-per-run test data so tests can execute in parallel and be
 */
export function uniqueEmail(prefix = 'qa.user'): string {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 10_000);
  return `${prefix}.${stamp}.${rand}@example.com`;
}

export function uniqueName(prefix = 'QA User'): string {
  return `${prefix} ${Date.now()}`;
}

