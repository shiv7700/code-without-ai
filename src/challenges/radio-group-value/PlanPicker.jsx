/**
 * Three boxes, one answer, and only one piece of state
 *
 * Topics: radio inputs · controlled input · derived checked
 * Read:   https://react.dev/reference/react-dom/components/input
 * Read:   https://react.dev/learn/sharing-state-between-components
 *
 * Rules:
 *  1. radios for "Free", "Pro" and "Team", with "Free" picked to begin with
 *  2. picking one leaves exactly one picked
 *  3. a paragraph reads "You picked: Pro" and follows the choice
 *
 * The temptation is one boolean per radio, and then three of them can be true
 * at once. Whether a radio is filled in is not something to store — it is a
 * question you can answer from the single value you already have.
 */
export default function PlanPicker() {
  return null
}
