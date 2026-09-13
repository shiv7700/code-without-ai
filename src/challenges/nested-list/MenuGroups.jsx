/**
 * A map inside a map needs a key at both levels
 *
 * Topics: nested lists · keys · JSX expressions
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body
 *
 * @param {{id: string, title: string, items: {id: string, label: string}[]}[]} groups
 *
 * Rules:
 *  1. one <section> per group, each starting with an <h3> holding the title
 *  2. inside each section a <ul> with one <li> per item, in order
 *  3. a group with no items renders its heading and no <ul>
 *  4. the same label may appear in two different groups, and both render
 *
 * Two things go wrong here and only one of them is loud. The inner map wants
 * its own key — and a label is not unique across groups, so it is a poor one.
 * The quiet failure is the outer callback written with braces instead of
 * parentheses: it returns undefined, the page comes up blank, and nothing
 * anywhere complains.
 */
export default function MenuGroups() {
  return null
}
