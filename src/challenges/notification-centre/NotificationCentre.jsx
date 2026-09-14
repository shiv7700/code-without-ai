/**
 * A count you keep is a count you have to defend
 *
 * Topics: grouping · derived counts · idempotent updates
 * Read:   https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 *
 * Props: { notifications: [{ id, group, title, read }] }
 *
 * Render:
 *   - <span data-testid="unread"> with the total unread, and NOT rendered at
 *     all when that total is zero
 *   - a button "Mark all read"
 *   - per group, in the order the groups first appear, a
 *     <section data-testid="group-Mentions"> with a heading "Mentions (1)" —
 *     the name and how many of its notifications are unread
 *   - one <li data-testid="note" data-read="false"> per notification, in the
 *     order given, each with a button "Mark Reply from Cid read"
 *
 * Rules:
 *  1. Groups come out in the order they first turn up in the list, and the
 *     notifications inside a group keep their order too.
 *  2. Marking a notification read lowers every number that counted it.
 *  3. Marking one that is already read changes nothing.
 *  4. "Mark all read" leaves nothing unread anywhere.
 *
 * Rule 3 is the one that decides your design. Hold the unread total as a
 * number and every action has to know whether it is allowed to change it;
 * derive it from the notifications and the question never comes up. The same
 * argument settles the per-group numbers.
 */
export default function NotificationCentre({ notifications }) {
  return null
}
