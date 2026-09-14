/**
 * A Map is not an object and a Set is not an array
 *
 * Topics: rendering lists · Map and Set · iteration
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 *
 * @param {Map<string, number>} stock     name → how many
 * @param {Set<string>} [lowStock]        names to flag
 *
 * Rules:
 *  1. one <li> per entry of `stock`, in the Map's own order, reading "Apple: 3"
 *  2. an entry whose count is 0 is still a row
 *  3. a row whose name is in `lowStock` has className "low"; every other row
 *     has no class at all
 *  4. no `lowStock` prop is fine — nothing is low
 *  5. an empty Map renders [data-testid="empty"] reading "Nothing in stock",
 *     and no <ul>
 *
 * Neither of these has the properties you are used to reaching for. `.map` is
 * not on either of them, spreading one into an object gives you `{}`, and rule
 * 5 fails quietly in a way you will recognise: `stock.length` is not 0, it is
 * undefined, so the empty branch never runs and the page shows an empty box.
 */
export default function Inventory() {
  return null
}
