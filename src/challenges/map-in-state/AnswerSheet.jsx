/**
 * An empty Map is still a Map
 *
 * Topics: Map in state · what the mutating methods return · empty is not absent
 * Read:   https://react.dev/learn/updating-objects-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 *
 * @param {{id: string, prompt: string}[]} questions
 * @param {(answers: Map<string, string>) => void} onChange
 *
 * Render, per question, an input labelled with its prompt and a button named
 * "Clear <prompt>". The number of answered questions goes in
 * [data-testid="count"].
 *
 * Rules:
 *  1. the answers live in ONE Map keyed by question id, empty to start with
 *  2. typing sets that id's answer
 *  3. "Clear" takes the id out of the Map — `has(id)` is false afterwards, not
 *     an empty string
 *  4. every change calls `onChange` with the Map
 *  5. clearing the last answer leaves an empty Map. Not undefined, not `{}`,
 *     not `false`
 *
 * None of the mutating methods return what you want to keep. `set` gives the
 * Map back, which hides the fact that it is the same one React already has;
 * `delete` gives a boolean, and that is what ends up in state, so the next
 * render asks `false` for a `get`. `{...map}` is the third way to lose it all:
 * a Map keeps nothing in its own properties, so the copy is an empty object.
 */
export default function AnswerSheet({ questions = [], onChange }) {
  return null
}
