/**
 * The counts have to answer the question you are about to ask
 *
 * Topics: derived state · selection as a Set · faceted counts
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 *
 * Props: { items: [{ id, title, tags: string[] }] }
 *
 * Render:
 *   - one button per distinct tag, in the order the tags first turn up,
 *     data-testid="tag", reading "react 3", with aria-pressed
 *   - one <li data-testid="item"> per visible item, holding its title
 *
 * Rules:
 *  1. With nothing picked, every item is visible.
 *  2. An item is visible only if it carries EVERY picked tag.
 *  3. The number on a tag is how many items would be left if that tag were
 *     picked as well — so a tag already picked reads the number on screen.
 *  4. A tag that would leave nothing is disabled. A picked tag never is.
 *  5. Clicking a picked tag drops it again.
 *
 * Rule 3 is the whole exercise. Counting each tag across the original list
 * gives the right four numbers on the first render and never moves again —
 * and "css 2" beside a list with one css post in it is worse than no count.
 */
export default function TagFilter({ items }) {
  return null
}
