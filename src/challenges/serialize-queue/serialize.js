/**
 * One at a time, in the order they were asked for, and a failure is not the end
 *
 * Topics: promise chaining · queueing · isolating a rejection
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
 *
 * @param {(...args: *) => Promise<*>} fn
 * @returns {(...args: *) => Promise<*>} the same function, one call at a time
 *
 * Rules:
 *  1. Calls run in the order they were made. The second does not start until
 *     the first has settled.
 *  2. Each caller gets back its own result, resolved with what its own call
 *     produced.
 *  3. A rejection reaches that caller and nobody else. The queue carries on
 *     with the next call as if nothing happened.
 *  4. After the queue has drained, calling again starts it up again.
 *  5. Arguments are passed through.
 *
 * Rule 3 is the whole thing, and it is two bugs in one line. Chaining the next
 * call onto the previous promise means a rejection poisons the chain — every
 * later call is skipped and quietly rejected with an error from someone else's
 * request. Swallow that rejection to keep the queue moving and you have
 * swallowed it for the caller who was waiting for it, too. The caller and the
 * queue need different views of the same promise.
 */
export function serialize(fn) {
  throw new Error('not implemented')
}
