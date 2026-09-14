/**
 * 1.10.0 is newer than 1.9.0, and every string comparison disagrees
 *
 * Topics: comparators · parsing · semver ordering
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
 * Read:   https://semver.org/#spec-item-11
 *
 * @param {string} a
 * @param {string} b
 * @returns {-1|0|1} suitable for passing straight to sort
 *
 * Rules:
 *  1. Segments are compared as numbers, left to right: "1.10.0" is above
 *     "1.9.0".
 *  2. A missing segment counts as zero, so "1.2" and "1.2.0" are equal.
 *  3. A leading "v" is ignored, in either case: "v1.0.0" equals "1.0.0".
 *  4. Everything after the first "-" is a pre-release tag. A version with one
 *     comes BEFORE the same version without one: "1.0.0-beta" is below "1.0.0".
 *  5. Two pre-release tags compare as plain strings. That is enough here.
 *  6. It returns exactly -1, 0 or 1 — not a difference.
 *
 * Rule 1 kills the one-liner, and rule 4 kills the second attempt. Pre-release
 * is the only place in this ordering where having more of something makes a
 * version smaller, so the comparison you already wrote has to be turned around
 * for exactly that one field.
 */
export function compareVersions(a, b) {
  throw new Error('not implemented')
}
