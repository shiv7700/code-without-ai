/**
 * LEVEL 35 — the empty case is a case, not an afterthought
 *
 * Topics: early return · optional chaining · conditional rendering
 * Read:   https://react.dev/learn/conditional-rendering
 * Read:   https://react.dev/learn/rendering-lists
 *
 * Rules:
 *  1. items given — a <ul> with one <li> each
 *  2. items empty — the `empty` message instead, and NO list element at all
 *  3. no items prop at all — same as empty, and it must not throw
 *  4. `empty` defaults to "Nothing here yet"
 *
 * An empty <ul> is not an empty state. It is a blank rectangle that looks like
 * a bug. Decide which of the two things you are rendering before you render.
 */
export default function ItemList() {
  return null
}
