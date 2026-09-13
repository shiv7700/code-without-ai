/**
 * A trail of links, minus the last one
 *
 * Topics: semantic lists · aria-current · decorative content
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current
 *
 * Props: { items: [{ label, href }] }
 *
 * Rules:
 *  1. A <nav> labelled "Breadcrumb", holding an <ol>.
 *  2. Exactly one <li> per item. No more.
 *  3. Every crumb but the last is an <a href>.
 *  4. The last crumb is not a link. It carries aria-current="page".
 *  5. A "/" sits between crumbs — never before the first, never after the
 *     last — and it is aria-hidden="true".
 *  6. An empty list renders nothing.
 *
 * A separator is punctuation, not a step in the trail. Give it its own <li>
 * and a screen reader announces "list, 5 items" for a three-crumb path, then
 * reads two of them out as "slash".
 */
export default function Breadcrumbs({ items = [] }) {
  return null
}
