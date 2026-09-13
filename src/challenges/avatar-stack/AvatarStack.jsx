/**
 * The overflow chip takes a slot of its own
 *
 * Topics: off-by-one · slicing · labelling non-text content
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label
 *
 * Props: { users: [{ id, name, avatar }], max = 3 }
 *
 * Render a <ul>. Each visible user is an <li> holding
 * <img src={avatar} alt={name} />.
 *
 * Rules:
 *  1. `max` is the number of list items on screen, in total.
 *  2. Fewer users than that, or exactly that many — show them all, no chip.
 *  3. More than that — the LAST list item is a "+N" chip instead of an avatar.
 *  4. N is every user not shown, and it carries an aria-label of "N more".
 *  5. max = 1 with four users is a chip and nothing else.
 *
 * The chip is not free. It stands in one of the `max` slots, so it hides the
 * user it replaced as well as the ones past the end. `users.length - max` is
 * the number you will write first, and it is short by exactly one.
 */
export default function AvatarStack({ users = [], max = 3 }) {
  return null
}
