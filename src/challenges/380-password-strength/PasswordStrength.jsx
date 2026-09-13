/**
 * LEVEL 33 — a score you never store
 *
 * Topics: derived state · pure helpers · conditional labels
 * Read:   https://react.dev/learn/you-might-not-need-an-effect
 *
 * Props: none
 *
 * Render an input labelled "Password" (type="password"), a meter with
 * data-testid="meter", and a list of unmet rules.
 *
 * Four rules, one point each:
 *   - at least 8 characters
 *   - a lowercase letter
 *   - an uppercase letter
 *   - a digit
 *
 * The meter carries data-score="0".."4" and reads:
 *   0-1 "Weak" · 2-3 "Medium" · 4 "Strong"
 *
 * Rules:
 *  1. An empty field scores 0 and reads "Weak".
 *  2. Every rule not yet met renders as an item with data-testid="missing",
 *     in the order listed above. A met rule disappears from the list.
 *  3. The only state is the password. Score, label and missing rules are all
 *     worked out during render.
 */
export default function PasswordStrength() {
  return null
}
