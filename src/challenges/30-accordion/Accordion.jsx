/**
 * LEVEL 30 — one open at a time, or many
 *
 * Topics: controlled disclosure · aria-expanded · conditional rendering
 * Read:   https://react.dev/learn/conditional-rendering
 *
 * Props: { items: [{ id, title, body }], allowMultiple = false }
 *
 * Each item renders a button showing its title. The body only exists in the
 * DOM while that item is open.
 *
 * Rules:
 *  1. Everything starts closed.
 *  2. Clicking a closed item opens it; clicking an open one closes it.
 *  3. By default only one is open at a time — opening a second closes the first.
 *  4. With allowMultiple, any number can be open together.
 *  5. Every button carries aria-expanded, "true" or "false".
 *
 * The two modes differ only in what the click handler stores. Do not write the
 * component twice.
 */
export default function Accordion({ items, allowMultiple = false }) {
  return null
}
