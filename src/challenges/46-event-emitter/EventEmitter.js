/**
 * LEVEL 46 — a message bus
 *
 * Topics: Map · subscription lists · iterating a list that changes
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
 *
 * API:
 *   on(name, callback)    subscribe. Returns a function that unsubscribes.
 *   off(name, callback)   remove one subscription.
 *   emit(name, ...args)   call every subscriber of `name` with `...args`.
 *
 * Rules:
 *  1. Subscribers are called in subscription order, with every emitted argument.
 *  2. Emitting an event with no subscribers is a no-op, not an error.
 *  3. Events are independent — 'ping' subscribers never hear 'pong'.
 *  4. The same callback subscribed twice is called twice, and one `off` removes
 *     ONE of them.
 *  5. Two emitters share nothing.
 *  6. A subscriber that unsubscribes itself DURING an emit must not cause the
 *     next subscriber to be skipped.
 *
 * Rule 6 is the real bug here. Splicing an array while a `for` loop is walking
 * it shifts everything left under the loop's index. Emit over a snapshot.
 */
export class EventEmitter {
  on(name, callback) {
    throw new Error('not implemented')
  }

  off(name, callback) {
    throw new Error('not implemented')
  }

  emit(name, ...args) {
    throw new Error('not implemented')
  }
}
