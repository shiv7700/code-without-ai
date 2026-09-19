/**
 * The dropdown's answer lives on the list, not on the options
 *
 * Topics: select · controlled input · option values
 * Read:   https://react.dev/reference/react-dom/components/select
 * Read:   https://react.dev/learn/reacting-to-input-with-state
 *
 * Rules:
 *  1. a dropdown labelled "Country" with India, Germany and Brazil
 *  2. each option carries a code — IN, DE, BR — and India starts chosen
 *  3. a paragraph reads "Shipping to DE" and follows the choice
 *
 * In plain HTML you mark the chosen option. React does not work that way, and
 * the option you would have marked is not where the current answer belongs.
 * What the user reads and what the code stores are also two different strings.
 */
export default function CountrySelect() {
  return null
}
