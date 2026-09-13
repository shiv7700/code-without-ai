import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import DropdownMenu from './DropdownMenu'

const ITEMS = ['Rename', 'Duplicate', 'Delete']

const setup = () => {
  const user = userEvent.setup()
  const onSelect = vi.fn()
  render(
    <div>
      <DropdownMenu items={ITEMS} onSelect={onSelect} />
      <button>Outside</button>
    </div>,
  )
  return { user, onSelect, trigger: screen.getByRole('button', { name: 'Options' }) }
}

const item = (name) => screen.getByRole('menuitem', { name })

test('the menu starts closed', () => {
  setup()
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

test('the trigger says whether it is open', async () => {
  const { user, trigger } = setup()
  expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await user.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
})

test('clicking the trigger opens the menu', async () => {
  const { user, trigger } = setup()
  await user.click(trigger)

  expect(screen.getAllByRole('menuitem').map((i) => i.textContent)).toEqual(ITEMS)
})

test('opening moves focus to the first item', async () => {
  const { user, trigger } = setup()
  await user.click(trigger)

  expect(item('Rename')).toHaveFocus()
})

test('arrow down moves the focus along', async () => {
  const { user, trigger } = setup()
  await user.click(trigger)
  await user.keyboard('{ArrowDown}')

  expect(item('Duplicate')).toHaveFocus()
})

test('the focus wraps at both ends', async () => {
  const { user, trigger } = setup()
  await user.click(trigger)
  await user.keyboard('{ArrowUp}')
  expect(item('Delete')).toHaveFocus()

  await user.keyboard('{ArrowDown}')
  expect(item('Rename')).toHaveFocus()
})

test('clicking an item selects it and closes the menu', async () => {
  const { user, trigger, onSelect } = setup()
  await user.click(trigger)
  await user.click(item('Delete'))

  expect(onSelect).toHaveBeenCalledWith('Delete')
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

test('enter selects the focused item', async () => {
  const { user, trigger, onSelect } = setup()
  await user.click(trigger)
  await user.keyboard('{ArrowDown}{Enter}')

  expect(onSelect).toHaveBeenCalledWith('Duplicate')
})

test('escape closes without selecting', async () => {
  const { user, trigger, onSelect } = setup()
  await user.click(trigger)
  await user.keyboard('{Escape}')

  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  expect(onSelect).not.toHaveBeenCalled()
})

test('closing puts the focus back on the trigger', async () => {
  const { user, trigger } = setup()
  await user.click(trigger)
  await user.keyboard('{Escape}')

  expect(trigger).toHaveFocus()
})

test('clicking outside closes the menu', async () => {
  const { user, trigger } = setup()
  await user.click(trigger)
  await user.click(screen.getByRole('button', { name: 'Outside' }))

  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

test('reopening starts at the first item again', async () => {
  const { user, trigger } = setup()
  await user.click(trigger)
  await user.keyboard('{ArrowDown}{Escape}')
  await user.click(trigger)

  expect(item('Rename')).toHaveFocus()
})
