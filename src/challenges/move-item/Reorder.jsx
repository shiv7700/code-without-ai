/**
 * Moving a row up and down a list you are not allowed to touch
 *
 * Topics: array state · swapping · copy before you write
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array
 *
 * @param {string[]} initial  the starting order
 *
 * Render a <ul> with one <li> per item. Every row has a button named
 * "Up <item>" and one named "Down <item>".
 *
 * Rules:
 *  1. "Up" swaps the row with the one above it, "Down" with the one below
 *  2. the first row's "Up" and the last row's "Down" are disabled
 *  3. moving the same row twice moves it twice — the buttons keep working
 *  4. `initial` is never modified
 *
 * `const next = items` is not a copy, it is a second name for the same array.
 * Write a swap into it and you have edited the array in state, which React then
 * compares against itself and declines to re-render — so the first click looks
 * like it did nothing and the second click looks like it did two things.
 */
export default function Reorder({ initial = [] }) {
  return null
}
