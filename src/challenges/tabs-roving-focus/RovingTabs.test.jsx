import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import RovingTabs from './RovingTabs'

const TABS = [
  { id: 'a', label: 'First', panel: 'panel A' },
  { id: 'b', label: 'Second', panel: 'panel B' },
  { id: 'c', label: 'Third', panel: 'panel C' },
]

const tab = (name) => screen.getByRole('tab', { name })
const selected = () =>
  screen.getByRole('tab', { selected: true }).textContent

const show = (props = {}) =>
  render(
    <>
      <RovingTabs tabs={TABS} {...props} />
      <button type="button">After</button>
    </>,
  )

test('the first tab is selected and its panel is the only one rendered', () => {
  show()

  expect(screen.getAllByRole('tab')).toHaveLength(3)
  expect(selected()).toBe('First')
  expect(screen.getByRole('tabpanel')).toHaveTextContent('panel A')
  expect(screen.queryByText('panel B')).toBeNull()
})

test('only the selected tab is in the tab order', () => {
  show()

  expect(tab('First')).toHaveAttribute('tabindex', '0')
  expect(tab('Second')).toHaveAttribute('tabindex', '-1')
  expect(tab('Third')).toHaveAttribute('tabindex', '-1')
})

test('arrows move focus and wrap', async () => {
  show()
  tab('First').focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(tab('Second')).toHaveFocus()

  await userEvent.keyboard('{ArrowRight}{ArrowRight}')
  expect(tab('First')).toHaveFocus()

  await userEvent.keyboard('{ArrowLeft}')
  expect(tab('Third')).toHaveFocus()
})

test('Home and End go to the ends', async () => {
  show()
  tab('Second').focus()

  await userEvent.keyboard('{End}')
  expect(tab('Third')).toHaveFocus()

  await userEvent.keyboard('{Home}')
  expect(tab('First')).toHaveFocus()
})

test('automatic activation selects as focus moves', async () => {
  show()
  tab('First').focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(selected()).toBe('Second')
  expect(screen.getByRole('tabpanel')).toHaveTextContent('panel B')
})

test('manual activation moves focus without changing the panel', async () => {
  show({ activation: 'manual' })
  tab('First').focus()

  await userEvent.keyboard('{ArrowRight}{ArrowRight}')
  expect(tab('Third')).toHaveFocus()
  expect(selected()).toBe('First')
  expect(screen.getByRole('tabpanel')).toHaveTextContent('panel A')
})

test('manual activation commits on Enter and on Space', async () => {
  show({ activation: 'manual' })
  tab('First').focus()

  await userEvent.keyboard('{ArrowRight}{Enter}')
  expect(selected()).toBe('Second')

  await userEvent.keyboard('{ArrowRight} ')
  expect(selected()).toBe('Third')
})
