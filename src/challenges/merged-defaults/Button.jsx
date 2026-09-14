/**
 * Three sources for one prop, and undefined is not one of them
 *
 * Topics: default values · merging props · undefined
 * Read:   https://react.dev/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 *
 * @param {{variant?: string, size?: string, style?: object}} [preset]
 *
 * Rules:
 *  1. renders a <button> with the children as its label
 *  2. `variant` and `size` each come from the first source that actually gives
 *     one: the props on the element, then `preset`, then the built-in
 *     defaults "solid" and "md"
 *  3. className is "btn btn--{variant} btn--{size}", with the caller's
 *     `className` appended after it — one space between, none at either end
 *  4. `style` merges: the preset's keys, then the caller's, key by key. The
 *     caller wins on a clash and keeps the rest
 *  5. `variant={undefined}` is not passing a variant. The preset still wins,
 *     and with no preset the built-in default does
 *
 * Rule 5 is why `{...defaults, ...preset, ...props}` is not the answer. A
 * spread copies a key that is present with no value, so one optional prop
 * threaded down from a parent — `variant={row.variant}` on a row that has none
 * — lands as undefined and wipes out every default underneath it. React's own
 * way of writing a default does not have this problem, which is the hint.
 */
export default function Button() {
  return null
}
