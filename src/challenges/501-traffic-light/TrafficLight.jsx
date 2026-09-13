/**
 * LEVEL 56 — a light that changes itself
 *
 * Topics: useEffect · setTimeout · state as an index
 * Read:   https://react.dev/reference/react/useEffect#connecting-to-an-external-system
 * Read:   https://react.dev/learn/choosing-the-state-structure
 *
 * Render:
 *   three <span data-testid="light"> in the order green, yellow, red.
 *   Each carries data-color="green" | "yellow" | "red" and
 *   data-active={true} on exactly one of them.
 *
 * Rules:
 *  1. Starts on green.
 *  2. green holds 3000ms, then yellow for 500ms, then red for 2000ms, then
 *     back to green — forever.
 *  3. Exactly one light is active at any moment.
 *  4. Unmounting must not leave a timer running.
 *
 * The durations differ per colour, so a single `setInterval` will not do it.
 * One `setTimeout` whose delay depends on the current colour, re-armed by the
 * effect each time the colour changes, will.
 *
 * Keep the sequence as data outside the component. It never changes, so it has
 * no business being rebuilt every render.
 */
export default function TrafficLight() {
  return null
}
