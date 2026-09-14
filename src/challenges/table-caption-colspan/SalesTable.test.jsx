import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import SalesTable from './SalesTable'

const COLUMNS = [
  { key: 'region', header: 'Region' },
  { key: 'units', header: 'Units' },
  { key: 'total', header: 'Total' },
]

const ROWS = [
  { id: 'a', region: 'North', units: 12, total: '£120' },
  { id: 'b', region: 'South', units: 4, total: '£40' },
]

test('the caption names the table', () => {
  render(<SalesTable caption="Q3 sales" columns={COLUMNS} rows={ROWS} />)
  expect(screen.getByRole('table', { name: 'Q3 sales' })).toBeInTheDocument()
})

test('the caption is the first thing inside the table', () => {
  const { container } = render(
    <SalesTable caption="Q3 sales" columns={COLUMNS} rows={ROWS} />,
  )
  expect(container.querySelector('table').firstElementChild.tagName).toBe('CAPTION')
})

test('a header cell per column, in order', () => {
  render(<SalesTable caption="Q3 sales" columns={COLUMNS} rows={ROWS} />)

  const headers = screen.getAllByRole('columnheader')
  expect(headers.map((th) => th.textContent.trim())).toEqual(['Region', 'Units', 'Total'])
  expect(headers.every((th) => th.getAttribute('scope') === 'col')).toBe(true)
})

test('a body row per entry, a cell per column', () => {
  render(<SalesTable caption="Q3 sales" columns={COLUMNS} rows={ROWS} />)

  const cells = screen.getAllByRole('cell')
  expect(cells.map((td) => td.textContent.trim())).toEqual([
    'North',
    '12',
    '£120',
    'South',
    '4',
    '£40',
  ])
})

test('with no rows, one cell spans the whole table', () => {
  render(<SalesTable caption="Q3 sales" columns={COLUMNS} rows={[]} />)

  const cells = screen.getAllByRole('cell')
  expect(cells).toHaveLength(1)
  expect(cells[0]).toHaveTextContent('No sales yet')
  expect(cells[0].colSpan).toBe(3)
})

test('the span follows the columns it was given', () => {
  render(<SalesTable caption="Q3 sales" columns={COLUMNS.slice(0, 2)} rows={[]} />)
  expect(screen.getByRole('cell').colSpan).toBe(2)
})
