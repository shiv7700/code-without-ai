import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TreeView from './TreeView'

const NODES = [
  {
    id: 'fruit',
    label: 'Fruit',
    children: [
      { id: 'apple', label: 'Apple' },
      {
        id: 'berries',
        label: 'Berries',
        children: [
          { id: 'blueberry', label: 'Blueberry' },
          { id: 'raspberry', label: 'Raspberry' },
        ],
      },
    ],
  },
  { id: 'bread', label: 'Bread' },
]

const item = (name) => screen.getByRole('treeitem', { name })
const visible = () =>
  screen.getAllByRole('treeitem').map((el) => el.getAttribute('aria-label'))

test('everything starts closed, and closed means not rendered', () => {
  render(<TreeView nodes={NODES} />)

  expect(screen.getByRole('tree')).toHaveAccessibleName('Files')
  expect(visible()).toEqual(['Fruit', 'Bread'])
  expect(item('Fruit')).toHaveAttribute('aria-expanded', 'false')
  expect(item('Fruit')).toHaveAttribute('aria-level', '1')
  expect(item('Bread')).not.toHaveAttribute('aria-expanded')
})

test('the whole tree is one tab stop', async () => {
  render(
    <>
      <TreeView nodes={NODES} />
      <button type="button">After</button>
    </>,
  )

  await userEvent.tab()
  expect(item('Fruit')).toHaveFocus()

  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
})

test('right opens a branch, and then walks into it', async () => {
  render(<TreeView nodes={NODES} />)
  item('Fruit').focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(item('Fruit')).toHaveAttribute('aria-expanded', 'true')
  expect(item('Fruit')).toHaveFocus()
  expect(visible()).toEqual(['Fruit', 'Apple', 'Berries', 'Bread'])

  await userEvent.keyboard('{ArrowRight}')
  expect(item('Apple')).toHaveFocus()
  expect(item('Apple')).toHaveAttribute('aria-level', '2')

  await userEvent.keyboard('{ArrowRight}')
  expect(item('Apple')).toHaveFocus()
})

test('left closes an open branch, and otherwise goes to the parent', async () => {
  render(<TreeView nodes={NODES} />)
  item('Fruit').focus()

  await userEvent.keyboard('{ArrowRight}{ArrowRight}')
  expect(item('Apple')).toHaveFocus()

  await userEvent.keyboard('{ArrowLeft}')
  expect(item('Fruit')).toHaveFocus()
  expect(item('Fruit')).toHaveAttribute('aria-expanded', 'true')

  await userEvent.keyboard('{ArrowLeft}')
  expect(item('Fruit')).toHaveAttribute('aria-expanded', 'false')
  expect(visible()).toEqual(['Fruit', 'Bread'])

  await userEvent.keyboard('{ArrowLeft}')
  expect(item('Fruit')).toHaveFocus()
})

test('down and up walk only what is on screen', async () => {
  render(<TreeView nodes={NODES} />)
  item('Fruit').focus()

  await userEvent.keyboard('{ArrowDown}')
  expect(item('Bread')).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  expect(item('Bread')).toHaveFocus()

  await userEvent.keyboard('{ArrowUp}{ArrowRight}{ArrowDown}')
  expect(item('Apple')).toHaveFocus()
})

test('Home and End follow whatever is open at the time', async () => {
  render(<TreeView nodes={NODES} />)
  item('Fruit').focus()

  await userEvent.keyboard('{End}')
  expect(item('Bread')).toHaveFocus()

  await userEvent.keyboard('{Home}{ArrowRight}{ArrowDown}{ArrowDown}{ArrowRight}')
  expect(item('Berries')).toHaveAttribute('aria-expanded', 'true')

  await userEvent.keyboard('{End}')
  expect(item('Bread')).toHaveFocus()

  await userEvent.keyboard('{ArrowUp}')
  expect(item('Raspberry')).toHaveFocus()
  expect(item('Raspberry')).toHaveAttribute('aria-level', '3')
})
