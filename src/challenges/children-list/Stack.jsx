/**
 * props.children is one node, or many, and you do not get to choose
 *
 * Topics: children · React.Children · toArray
 * Read:   https://react.dev/reference/react/Children
 * Read:   https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children
 *
 * Rules:
 *  1. a <ul> with each child wrapped in its own <li>, in order
 *  2. [data-testid="count"] holds how many children there are
 *  3. exactly one child still gets an <li>, and the count is 1
 *  4. no children at all → an empty <ul> and a count of 0
 *  5. a child that is null or false is not counted and gets no <li>
 *
 * With two children `props.children` is an array and `.map` works. With one it
 * is that child on its own — `.map` is not a function — so the component that
 * looked finished in the playground throws the first time someone passes it a
 * single row. The count has the same shape of problem from the other side.
 */
export default function Stack() {
  return null
}
