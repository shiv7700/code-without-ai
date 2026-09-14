import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import OutlineTree from './OutlineTree'

const TREE = [
  {
    id: 'src',
    name: 'src',
    children: [
      { id: 'app', name: 'App.jsx' },
      { id: 'lib', name: 'lib', children: [{ id: 'util', name: 'util.js' }] },
    ],
  },
  { id: 'readme', name: 'README.md', children: [] },
]

const depthOf = (name) => screen.getByText(name).getAttribute('data-depth')

test('top level nodes are at depth zero', () => {
  render(<OutlineTree nodes={TREE} />)

  expect(depthOf('src')).toBe('0')
  expect(depthOf('README.md')).toBe('0')
})

test('children are one deeper, and grandchildren one deeper again', () => {
  render(<OutlineTree nodes={TREE} />)

  expect(depthOf('App.jsx')).toBe('1')
  expect(depthOf('lib')).toBe('1')
  expect(depthOf('util.js')).toBe('2')
})

test('a child sits inside its parent row', () => {
  render(<OutlineTree nodes={TREE} />)

  const parent = screen.getByText('src').closest('li')
  expect(parent).toContainElement(screen.getByText('App.jsx'))
  expect(parent).not.toContainElement(screen.getByText('README.md'))
})

test('a leaf has no list under it, empty children or none at all', () => {
  const { container } = render(<OutlineTree nodes={TREE} />)

  // the root list, src's children, and lib's children — and nothing else
  expect(container.querySelectorAll('ul')).toHaveLength(3)
})

test('every node is rendered once', () => {
  render(<OutlineTree nodes={TREE} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(5)
})

test('no nodes renders an empty list', () => {
  const { container } = render(<OutlineTree nodes={[]} />)

  expect(container.querySelectorAll('ul')).toHaveLength(1)
  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})
