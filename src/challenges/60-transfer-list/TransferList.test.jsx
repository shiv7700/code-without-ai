import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TransferList from './TransferList'

const setup = (props = { left: ['apple', 'banana', 'cherry'], right: ['damson'] }) => ({
  user: userEvent.setup(),
  ...render(<TransferList {...props} />),
})

const side = (name) => within(screen.getByTestId(name))
const items = (name) => side(name).queryAllByRole('checkbox').map((box) => box.closest('label').textContent)
const check = (user, name, item) => user.click(side(name).getByLabelText(item))

test('renders both sides', () => {
  setup()
  expect(items('left')).toEqual(['apple', 'banana', 'cherry'])
  expect(items('right')).toEqual(['damson'])
})

test('the move buttons start disabled', () => {
  setup()
  expect(screen.getByRole('button', { name: 'Move right' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Move left' })).toBeDisabled()
})

test('checking something on the left enables only the right-hand move', async () => {
  const { user } = setup()
  await check(user, 'left', 'apple')

  expect(screen.getByRole('button', { name: 'Move right' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Move left' })).toBeDisabled()
})

test('moves the checked item across', async () => {
  const { user } = setup()
  await check(user, 'left', 'banana')
  await user.click(screen.getByRole('button', { name: 'Move right' }))

  expect(items('left')).toEqual(['apple', 'cherry'])
  expect(items('right')).toEqual(['damson', 'banana'])
})

test('moves several at once, keeping their order', async () => {
  const { user } = setup()
  await check(user, 'left', 'apple')
  await check(user, 'left', 'cherry')
  await user.click(screen.getByRole('button', { name: 'Move right' }))

  expect(items('left')).toEqual(['banana'])
  expect(items('right')).toEqual(['damson', 'apple', 'cherry'])
})

test('moved items arrive unchecked', async () => {
  const { user } = setup()
  await check(user, 'left', 'apple')
  await user.click(screen.getByRole('button', { name: 'Move right' }))

  expect(side('right').getByLabelText('apple')).not.toBeChecked()
  expect(screen.getByRole('button', { name: 'Move left' })).toBeDisabled()
})

test('it works in the other direction too', async () => {
  const { user } = setup()
  await check(user, 'right', 'damson')
  await user.click(screen.getByRole('button', { name: 'Move left' }))

  expect(items('left')).toEqual(['apple', 'banana', 'cherry', 'damson'])
  expect(items('right')).toEqual([])
})

test('unchecking again disables the button', async () => {
  const { user } = setup()
  await check(user, 'left', 'apple')
  await check(user, 'left', 'apple')

  expect(screen.getByRole('button', { name: 'Move right' })).toBeDisabled()
})

test('a checked item on one side does not enable the other side', async () => {
  const { user } = setup()
  await check(user, 'right', 'damson')

  expect(screen.getByRole('button', { name: 'Move right' })).toBeDisabled()
})
