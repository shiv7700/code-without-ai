/**
 * Cut a list at every separator, the way split cuts a string
 *
 * Topics: grouping · separators · empty groups
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 *
 * @param {Array} list
 * @param {(item: *, index: number) => boolean} predicate  true = this is a separator
 * @returns {Array[]} the groups between the separators
 *
 * Rules:
 *  1. A separator ends the group before it and starts the next one. The
 *     separator itself belongs to no group.
 *  2. Everything else keeps its order, in exactly one group.
 *  3. A separator at the very end leaves an empty group after it. One at the
 *     very start leaves an empty group before it.
 *  4. Two separators in a row leave an empty group between them.
 *  5. No separator at all gives one group holding everything.
 *  6. An empty list gives one empty group — `[[]]`, never `[]`.
 *  7. The input is never modified and no group is the input array itself.
 *
 * Rules 3 and 6 are the same rule twice, and both die to the same shortcut:
 * pushing the current group only when it has something in it. `''.split(',')`
 * is `['']` and `'a,'.split(',')` is `['a', '']` — a group with nothing in it
 * is still a group, and dropping it loses the fact that a separator was there.
 */
export function splitWhen(list, predicate) {
  throw new Error('not implemented')
}
