/**
 * LEVEL 59 — a component that renders itself
 *
 * Topics: recursive components · local state per node · sorting
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
 *
 * Props: { node: { name, children? } }
 *   A node with a `children` array is a folder. One without is a file.
 *
 * Render, for every node:
 *   <li data-testid="entry" data-name={node.name}>
 *   A folder also holds a <button> with its name and aria-expanded, and its
 *   children in a <ul> when open. A file is just its name.
 *
 * Rules:
 *  1. Every folder starts CLOSED, at every depth.
 *  2. A closed folder's children are absent from the DOM, not hidden.
 *  3. Clicking a folder toggles it. Each folder tracks its own open state —
 *     opening one must not open its siblings or its children.
 *  4. Children are ordered folders first, then files, each group sorted by
 *     name with `localeCompare` (so "package.json" comes before "README.md").
 *  5. Nesting goes as deep as the data does.
 *
 * Rule 3 is the reason this is one recursive component holding one boolean,
 * rather than one component holding a set of open paths.
 */
export default function FileTree({ node }) {
  return null
}
