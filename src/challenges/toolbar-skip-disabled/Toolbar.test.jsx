import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Toolbar from './Toolbar'

const ITEMS = [
  { id: 'bold', label: 'Bold' },
  { id: 'italic', label: 'Italic', disabled: true },
  { id: 'underline', label: 'Underline' },
  { id: 'strike', label: 'Strikethrough' },
  { id: 'link', label: 'Link', disabled: true },
]

const item = (name) => screen.getByRole('button', { name })

const show = (props = {}) =>
  render(
    <>
      <Toolbar items={ITEMS} onAction={() => {}} {...props} />
      <button type="button">After</button>
    </>,
  )

test('a named toolbar of buttons, with the dead ones disabled', () => {
  show()

  expect(screen.getByRole('toolbar')).toHaveAccessibleName('Formatting')
  expect(item('Italic')).toBeDisabled()
  expect(item('Bold')).toBeEnabled()
})

test('the whole toolbar is one tab stop', async () => {
  show()

  await userEvent.tab()
  expect(item('Bold')).toHaveFocus()

  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()
})

test('arrows step over the disabled items and wrap', async () => {
  show()
  item('Bold').focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(item('Underline')).toHaveFocus()

  await userEvent.keyboard('{ArrowLeft}')
  expect(item('Bold')).toHaveFocus()

  await userEvent.keyboard('{ArrowLeft}')
  expect(item('Strikethrough')).toHaveFocus()
})

test('Home and End land on something that can take focus', async () => {
  show()
  item('Underline').focus()

  await userEvent.keyboard('{End}')
  expect(item('Strikethrough')).toHaveFocus()

  await userEvent.keyboard('{Home}')
  expect(item('Bold')).toHaveFocus()
})

test('pressing an item reports it', async () => {
  const onAction = vi.fn()
  show({ onAction })

  await userEvent.click(item('Underline'))
  expect(onAction).toHaveBeenLastCalledWith('underline')

  item('Bold').focus()
  await userEvent.keyboard('{Enter}')
  expect(onAction).toHaveBeenLastCalledWith('bold')
})

test('the tab stop stays where the user left it', async () => {
  show()

  await userEvent.tab()
  await userEvent.keyboard('{ArrowRight}{ArrowRight}')
  expect(item('Strikethrough')).toHaveFocus()

  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus()

  await userEvent.tab({ shift: true })
  expect(item('Strikethrough')).toHaveFocus()
})
