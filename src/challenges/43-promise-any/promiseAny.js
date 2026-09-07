/**
 * LEVEL 43 — the first one that works
 *
 * Topics: promises · AggregateError · inverted counting
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
 *
 * @param {Array} items
 * @returns {Promise} the first fulfilled value
 *
 * Rules:
 *  1. Resolves with the first value to arrive. Rejections along the way are
 *     ignored as long as someone still might succeed.
 *  2. A rejection AFTER a win changes nothing — a settled promise is settled.
 *  3. If every one rejects, reject with an `AggregateError` whose `.errors`
 *     holds the reasons in INPUT order.
 *  4. An empty input rejects with an `AggregateError` rather than hanging.
 *
 * This is level 42 inverted: there, one failure ends it and success is counted;
 * here, one success ends it and failures are counted.
 */
export function promiseAny(items) {
  throw new Error('not implemented')
}
