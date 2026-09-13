/**
 * Roving tabindex, and the two ways a tab gets picked
 *
 * Topics: roving tabindex · refs to a list of DOM nodes · automatic vs manual activation
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 * Read:   https://react.dev/learn/manipulating-the-dom-with-refs
 *
 * Props: { tabs: [{ id, label, panel }], activation = 'automatic' }
 *
 * Rules:
 *  1. A role="tablist" of role="tab" buttons, and one role="tabpanel". Only
 *     the selected panel is in the DOM.
 *  2. aria-selected is "true" on the selected tab and "false" on the rest.
 *  3. The first tab is selected to begin with.
 *  4. Roving tabindex: the tab you would land on has tabIndex 0, every other
 *     tab has tabIndex -1. One Tab enters the tablist, the next Tab leaves it.
 *  5. ArrowRight and ArrowLeft move focus between tabs, wrapping at both ends.
 *     Home and End go to the first and last.
 *  6. activation="automatic" — moving focus selects that tab immediately.
 *  7. activation="manual" — moving focus selects nothing. Enter or Space does.
 *
 * Rule 4 is what a tablist is for: five tabs are one stop, not five, and Tab
 * takes you *past* the tabs to the content. Leave every button at the default
 * and the keyboard user walks through all of them one at a time — which also
 * makes rule 7 pointless, because focus never moves without a Tab anyway.
 */
export default function RovingTabs({ tabs = [], activation = 'automatic' }) {
  return null
}
