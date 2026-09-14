/**
 * A submenu that opens on hover, a moment after the pointer has moved on
 *
 * Topics: role=menu · booked work and cancelling it · pointer enter and leave
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 * Read:   https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
 *
 * Props: { items: [{ id, label, children }], schedule, onSelect,
 *          label = 'Main menu' }
 *
 * `schedule(fn)` books the opening and hands back a function that cancels it.
 * The test decides when a booking actually runs, so the delay never has to be
 * waited out.
 *
 * Rules:
 *  1. A role="menu" named `label`, holding a role="menuitem" per entry. An
 *     entry with children has aria-haspopup="menu" and aria-expanded.
 *  2. Nothing is open to start with, and a closed submenu is not in the
 *     document at all.
 *  3. Pointing at an entry with children books the opening. The submenu is
 *     not there until that booking runs.
 *  4. Moving the pointer off the entry before the booking runs cancels it —
 *     the submenu never appears.
 *  5. Only one submenu is ever open, and only the entry the pointer is on can
 *     open one. Sweep across three entries and the two you passed through
 *     must not open behind you.
 *  6. Moving off an entry whose submenu is open closes it.
 *  7. Choosing an item calls onSelect with its id.
 *  8. Unmounting with a booking still waiting cancels it.
 *
 * Rule 5 is why menus feel broken so often. Every entry you brush past books
 * its own opening, and unless the one you are leaving takes its booking back
 * on the way out, they all arrive a moment later and the menu blossoms behind
 * the pointer. Where you keep that cancel matters: it changes constantly and
 * nothing on screen depends on it.
 */
export default function MenuWithSubmenu({
  items = [],
  schedule,
  onSelect,
  label = 'Main menu',
}) {
  return null
}
