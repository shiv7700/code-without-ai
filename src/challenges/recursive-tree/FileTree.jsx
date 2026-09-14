/**
 * A component that renders itself, one level further down
 *
 * Topics: recursion · nested lists · a prop that changes as it descends
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://react.dev/learn/your-first-component
 *
 * @param {{id: string, name: string, children?: object[]}[]} nodes
 * @param {number} [depth=0]
 *
 * Rules:
 *  1. a <ul> with an <li> per node, in order
 *  2. inside each <li>, a <span data-depth="0"> holding the name — 0 at the
 *     top, 1 for its children, and so on however deep it goes
 *  3. a node with children renders another <ul> inside its own <li>
 *  4. a node with no children, or with an empty children array, renders no
 *     <ul> at all
 *  5. `nodes` empty renders an empty <ul>
 *
 * Rule 4 is the base case, and it is two cases that have to end up the same:
 * a missing key and an empty array. Checking only for the first leaves an empty
 * list element under every leaf in the tree, which is invisible until it picks
 * up the padding your CSS puts on lists. The depth is the other half — it is
 * not a counter you keep, it is a value each level hands to the next.
 */
export default function FileTree() {
  return null
}
