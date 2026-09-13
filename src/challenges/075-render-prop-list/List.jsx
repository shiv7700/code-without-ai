/**
 * LEVEL 75 — a prop that is a function you call while rendering
 *
 * Topics: render props · function props · rendering lists
 * Read:   https://react.dev/learn/passing-props-to-a-component
 * Read:   https://react.dev/learn/rendering-lists
 *
 * @param {any[]} items
 * @param {(item: any, index: number) => React.ReactNode} [renderItem]
 *
 * Rules:
 *  1. a <ul> with one <li> per item
 *  2. the <li> holds whatever `renderItem(item, index)` returns
 *  3. `renderItem` is called exactly once per item — no more
 *  4. no `renderItem` — fall back to String(item)
 *  5. no items — an empty <ul>, and `renderItem` never called
 *
 * The index is a fine key here, which contradicts level 30 for a reason worth
 * working out: nothing in these rows holds any state of its own.
 */
export default function List() {
  return null
}
