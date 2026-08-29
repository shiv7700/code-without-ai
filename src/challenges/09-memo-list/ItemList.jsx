/**
 * LEVEL 9 — React.memo + useCallback, measured by render counts
 *
 * Topics: memo · useCallback · why components re-render
 * Read:   https://react.dev/reference/react/memo
 * Read:   https://react.dev/reference/react/useCallback
 *
 * Props: {
 *   items:    [{ id, label }],
 *   onPick:   (id) => void,
 *   onRender: (id) => void      // call this at the top of EVERY Row render
 * }
 *
 * Render a <ul> with one Row per item. Each Row is a <li> containing a
 * <button> whose text is the label; clicking it calls onPick(item.id).
 *
 * Rules:
 *  1. ItemList owns a "selected" id in state. The selected Row's <li> gets
 *     data-selected="true".
 *  2. Clicking a Row selects it AND calls the onPick prop.
 *  3. Clicking a Row re-renders AT MOST 2 Rows — the one leaving selection and
 *     the one entering it. Not all of them.
 *
 * Rule 3 needs three things together, and it fails if you miss any one:
 *   - Row wrapped in memo()
 *   - the click handler stable across renders  (a fresh arrow per row kills it)
 *   - no fresh object/array props per render
 *
 * The trap: `onClick={() => onPick(item.id)}` inside the map is a new function
 * every render, so memo() compares props, sees a different function, and
 * re-renders anyway. Push the id down and let the Row call back with it.
 */
export default function ItemList({ items, onPick, onRender }) {
  return null
}
