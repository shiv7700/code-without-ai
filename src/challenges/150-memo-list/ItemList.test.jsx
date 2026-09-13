import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import ItemList from './ItemList'

const ITEMS = Array.from({ length: 6 }, (_, i) => ({ id: i, label: `Item ${i}` }))

const click = (n) => userEvent.click(screen.getByRole('button', { name: `Item ${n}` }))
const row = (n) => screen.getByRole('button', { name: `Item ${n}` }).closest('li')

function setup() {
  const rendered = []
  const onPick = vi.fn()
  const view = render(
    <ItemList items={ITEMS} onPick={onPick} onRender={(id) => rendered.push(id)} />,
  )
  return { rendered, onPick, ...view }
}

test('renders one row per item', () => {
  setup()
  expect(screen.getAllByRole('listitem')).toHaveLength(6)
})

test('clicking a row calls onPick with its id', async () => {
  const { onPick } = setup()

  await click(3)
  expect(onPick).toHaveBeenCalledWith(3)
})

test('clicking a row marks it selected', async () => {
  setup()

  await click(2)
  expect(row(2)).toHaveAttribute('data-selected', 'true')
  expect(row(4)).not.toHaveAttribute('data-selected', 'true')
})

test('selection moves from the old row to the new one', async () => {
  setup()

  await click(2)
  await click(4)
  expect(row(4)).toHaveAttribute('data-selected', 'true')
  expect(row(2)).not.toHaveAttribute('data-selected', 'true')
})

test('a click re-renders at most 2 rows, not all 6', async () => {
  const { rendered } = setup()

  rendered.length = 0
  await click(1)

  expect(rendered.length).toBeLessThanOrEqual(2)
  expect(rendered).toContain(1)
})

test('a second click still re-renders at most 2 rows', async () => {
  const { rendered } = setup()

  await click(1)
  rendered.length = 0
  await click(5)

  expect(rendered.length).toBeLessThanOrEqual(2)
  expect(rendered).toContain(5)
  expect(rendered).toContain(1) // the one losing selection
})
