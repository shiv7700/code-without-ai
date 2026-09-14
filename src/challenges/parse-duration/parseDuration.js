/**
 * "1h30m" is 5400000, and "1h junk" is not 3600000
 *
 * Topics: regular expressions · validation · zero as an answer
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
 *
 * @param {string} input
 * @returns {number|null} milliseconds, or null when the input is not a duration
 *
 * Rules:
 *  1. Units are ms, s, m, h, d, w. A week is seven days.
 *  2. A part is digits then a unit. Several parts add up, in any order:
 *     "1h30m" and "30m1h" are both 5400000.
 *  3. Spaces between parts are allowed, and the whole string is trimmed first.
 *  4. "0s" is zero milliseconds. Zero is an answer, not a failure.
 *  5. Anything that is not entirely made of parts returns null: "", "1", "1x",
 *     "1.5h", "-1h", "h1", "1h junk", and anything that is not a string.
 *  6. It returns null or a number. Never NaN, never undefined.
 *
 * Two traps, one on each side of rule 4. Summing whatever your regex happens to
 * find ignores the characters it skipped, so "1h junk" quietly becomes an hour —
 * matching parts and checking the string is nothing but parts are separate jobs.
 * And the guard you reach for to reject the junk is the same expression that
 * rejects a legitimate zero.
 */
export function parseDuration(input) {
  throw new Error('not implemented')
}
