/**
 * A handler is a function you hand over, not one you call
 *
 * Topics: event handlers · passing arguments · render vs click
 * Read:   https://react.dev/learn/responding-to-events
 * Read:   https://react.dev/learn/responding-to-events#passing-a-function-vs-calling-a-function
 *
 * @param {number[]} presets
 * @param {(amount: number) => void} onPick
 *
 * Render a running total in [data-testid="total"], starting at 0, and one
 * button per preset labelled with a sign — 5 gives a button called "+5".
 *
 * Rules:
 *  1. clicking a button adds that preset to the total
 *  2. clicking also calls `onPick` with that preset
 *  3. rendering calls nothing — before any click the total is 0 and `onPick`
 *     has not run once
 *  4. every button carries its own amount, not the last one in the list
 *
 * onClick wants a function. Put the call there instead and it runs while React
 * is still assembling the JSX — too early, and again on every single render.
 */
export default function PresetButtons({ presets = [], onPick }) {
  return null
}
