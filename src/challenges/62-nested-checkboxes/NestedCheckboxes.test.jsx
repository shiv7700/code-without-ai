import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import NestedCheckboxes from './NestedCheckboxes'

const TREE = [
  {
    id: 'food',
    name: 'Food',
    children: [
      {
        id: 'fruit',
        name: 'Fruit',
        children: [
          { id: 'apple', name: 'Apple' },
          { id: 'banana', name: 'Banana' },
        ],
      },
      { id: 'bread', name: 'Bread' },
    ],
  },
  { id: 'drink', name: 'Drink' },
]

const setup = () => ({ user: userEvent.setup(), ...render(<NestedCheckboxes tree={TREE} />) })
const box = (name) => screen.getByLabelText(name)

test('renders every node as a checkbox', () => {
  setup()
  expect(screen.getAllByRole('checkbox')).toHaveLength(6)
})

test('everything starts unchecked', () => {
  setup()
  expect(screen.getAllByRole('checkbox').every((b) => !b.checked)).toBe(true)
})

test('checking a leaf checks only that leaf', async () => {
  const { user } = setup()
  await user.click(box('Apple'))

  expect(box('Apple')).toBeChecked()
  expect(box('Banana')).not.toBeChecked()
  expect(box('Drink')).not.toBeChecked()
})

test('a half-filled parent is indeterminate, not checked', async () => {
  const { user } = setup()
  await user.click(box('Apple'))

  expect(box('Fruit')).not.toBeChecked()
  expect(box('Fruit').indeterminate).toBe(true)
})

test('the state travels all the way up', async () => {
  const { user } = setup()
  await user.click(box('Apple'))

  expect(box('Food').indeterminate).toBe(true)
})

test('checking every child checks the parent for real', async () => {
  const { user } = setup()
  await user.click(box('Apple'))
  await user.click(box('Banana'))

  expect(box('Fruit')).toBeChecked()
  expect(box('Fruit').indeterminate).toBe(false)
})

test('checking a parent checks everything under it', async () => {
  const { user } = setup()
  await user.click(box('Fruit'))

  expect(box('Apple')).toBeChecked()
  expect(box('Banana')).toBeChecked()
})

test('checking the root checks the whole subtree', async () => {
  const { user } = setup()
  await user.click(box('Food'))

  expect(box('Apple')).toBeChecked()
  expect(box('Bread')).toBeChecked()
  expect(box('Drink')).not.toBeChecked()
})

test('unchecking a parent clears everything under it', async () => {
  const { user } = setup()
  await user.click(box('Food'))
  await user.click(box('Food'))

  expect(screen.getAllByRole('checkbox').every((b) => !b.checked)).toBe(true)
})

test('unchecking one leaf downgrades its ancestors', async () => {
  const { user } = setup()
  await user.click(box('Food'))
  await user.click(box('Apple'))

  expect(box('Food')).not.toBeChecked()
  expect(box('Food').indeterminate).toBe(true)
  expect(box('Bread')).toBeChecked()
})

test('a leaf is never indeterminate', async () => {
  const { user } = setup()
  await user.click(box('Apple'))

  expect(box('Apple').indeterminate).toBe(false)
})
