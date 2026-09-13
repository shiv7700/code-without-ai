import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import KeepMountedAccordion from './KeepMountedAccordion'

const ITEMS = [
  { id: 'a', title: 'Shipping', body: <input aria-label="Address" /> },
  { id: 'b', title: 'Payment', body: <input aria-label="Card" /> },
  { id: 'c', title: 'Review', body: <p>All good</p> },
]

const head = (name) => screen.getByRole('button', { name })
const click = (name) => userEvent.click(head(name))
const panelOf = (name) =>
  document.getElementById(head(name).getAttribute('aria-controls'))

test('every panel is mounted, and all of them start hidden', () => {
  render(<KeepMountedAccordion items={ITEMS} />)

  expect(screen.getByLabelText('Address')).toBeInTheDocument()
  expect(screen.getByLabelText('Card')).toBeInTheDocument()
  ITEMS.forEach((i) => expect(panelOf(i.title)).not.toBeVisible())
})

test('opening one un-hides only that panel', async () => {
  render(<KeepMountedAccordion items={ITEMS} />)

  await click('Shipping')
  expect(panelOf('Shipping')).toBeVisible()
  expect(panelOf('Payment')).not.toBeVisible()
  expect(head('Shipping')).toHaveAttribute('aria-expanded', 'true')
  expect(head('Payment')).toHaveAttribute('aria-expanded', 'false')
})

test('opening a second closes the first', async () => {
  render(<KeepMountedAccordion items={ITEMS} />)

  await click('Shipping')
  await click('Payment')
  expect(panelOf('Shipping')).not.toBeVisible()
  expect(panelOf('Payment')).toBeVisible()
})

test('clicking the open header closes it', async () => {
  render(<KeepMountedAccordion items={ITEMS} />)

  await click('Shipping')
  await click('Shipping')
  expect(panelOf('Shipping')).not.toBeVisible()
  expect(head('Shipping')).toHaveAttribute('aria-expanded', 'false')
})

test('the open panel is a region named after its header', async () => {
  render(<KeepMountedAccordion items={ITEMS} />)

  await click('Review')
  expect(screen.getByRole('region', { name: 'Review' })).toBe(panelOf('Review'))
  expect(screen.getAllByRole('region')).toHaveLength(1)
})

test('what was typed in a panel survives closing and reopening it', async () => {
  render(<KeepMountedAccordion items={ITEMS} />)

  await click('Shipping')
  await userEvent.type(screen.getByLabelText('Address'), '221B Baker St')

  await click('Payment')
  await click('Shipping')
  expect(screen.getByLabelText('Address')).toHaveValue('221B Baker St')
})
