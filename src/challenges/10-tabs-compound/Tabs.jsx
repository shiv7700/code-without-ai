/**
 * LEVEL 10 — compound components
 *
 * Topics: compound components · context · children prop
 * Read:   https://react.dev/learn/passing-data-deeply-with-context
 * Read:   https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children
 *
 * Build a Tabs family that talks to each other through context, so the user
 * writes plain JSX with no wiring:
 *
 *   <Tabs defaultValue="a" onChange={fn}>
 *     <Tabs.List>
 *       <Tabs.Tab value="a">First</Tabs.Tab>
 *       <Tabs.Tab value="b">Second</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="a">panel A</Tabs.Panel>
 *     <Tabs.Panel value="b">panel B</Tabs.Panel>
 *   </Tabs>
 *
 * Rules:
 *  1. the active tab starts at `defaultValue`; if omitted, no tab is active
 *  2. only the ACTIVE panel is in the DOM — the others render nothing
 *  3. Tabs.Tab renders <button role="tab"> with aria-selected true/false
 *  4. Tabs.List renders a container with role="tablist"
 *  5. clicking a tab switches the panel and calls `onChange(value)`
 *  6. clicking the already-active tab does NOT call onChange again
 *  7. any of Tab / List / Panel used outside <Tabs> throws an Error
 *     whose message contains "Tabs"
 *
 * The point: no prop drilling and no index juggling. Parent holds the state,
 * children read it from context, and the consumer's JSX stays declarative.
 */
export default function Tabs({ children, defaultValue, onChange }) {
  return children
}

Tabs.List = function TabsList({ children }) {
  return null
}

Tabs.Tab = function TabsTab({ children, value }) {
  return null
}

Tabs.Panel = function TabsPanel({ children, value }) {
  return null
}
