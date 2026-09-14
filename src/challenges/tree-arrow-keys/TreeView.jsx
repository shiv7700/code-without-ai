/**
 * Left closes the branch you are on, unless it is already closed
 *
 * Topics: role=tree · recursive rendering · keyboard navigation
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 * Read:   https://react.dev/learn/rendering-lists
 *
 * Props: { nodes: [{ id, label, children }], label = 'Files' }
 *
 * Rules:
 *  1. A role="tree" named `label`. Every entry is a role="treeitem" carrying
 *     aria-level, counting from 1. A branch's children live in a role="group"
 *     inside it, and the branch carries aria-expanded. Leaves carry none.
 *     An item is named by its own label alone, through aria-label: leave the
 *     name to the contents and a branch's name swallows every child
 *     underneath it, which is no use to anyone.
 *  2. Everything starts closed, so a closed branch's children are not in the
 *     document at all.
 *  3. One tab stop for the whole tree, starting on the first item.
 *  4. ArrowDown and ArrowUp step through the items you can actually see, in
 *     the order they appear, and stop at the ends.
 *  5. ArrowRight on a closed branch opens it and stays put. On an open branch
 *     it moves to the first child. On a leaf it does nothing.
 *  6. ArrowLeft on an open branch closes it and stays put. Anywhere else it
 *     moves to the parent. At a closed root it does nothing.
 *  7. Home and End go to the first and last item you can see.
 *
 * Rules 4 and 7 keep changing their minds. The list of items a user can move
 * between is not the tree you were given — it is the tree with every closed
 * branch's contents cut out, and it is different after every press of the two
 * keys in rules 5 and 6. Work that list out once per render and the whole
 * keyboard falls out of it; work it out once at mount and the arrows will be
 * navigating a tree that no longer exists.
 */
export default function TreeView({ nodes = [], label = 'Files' }) {
  return null
}
