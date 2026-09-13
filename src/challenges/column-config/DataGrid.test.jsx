import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import DataGrid from './DataGrid'

const COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'city', header: 'City' },
  { key: 'age', header: 'Age' },
]

const bodyRows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1)
const cellsOf = (row) => within(row).getAllByRole('cell').map((td) => td.textContent)

test('a header per column, in order', () => {
  render(<DataGrid columns={COLUMNS} rows={[]} />)
  expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual([
    'Name',
    'City',
    'Age',
  ])
})

test('a cell per column, reading the row by key', () => {
  render(
    <DataGrid
      columns={COLUMNS}
      rows={[{ id: 1, name: 'Ada', city: 'London', age: 36 }]}
    />,
  )
  expect(cellsOf(bodyRows()[0])).toEqual(['Ada', 'London', '36'])
})

test('the row object can list its keys in any order', () => {
  render(
    <DataGrid
      columns={COLUMNS}
      rows={[{ age: 41, city: 'Paris', id: 2, name: 'Marie' }]}
    />,
  )
  expect(cellsOf(bodyRows()[0])).toEqual(['Marie', 'Paris', '41'])
})

test('a missing field leaves its own cell blank and shifts nothing', () => {
  render(<DataGrid columns={COLUMNS} rows={[{ id: 3, name: 'Grace', age: 45 }]} />)
  expect(cellsOf(bodyRows()[0])).toEqual(['Grace', '', '45'])
})

test('a column can render the cell itself', () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'age', header: 'Age', render: (row) => `${row.age} yrs` },
  ]
  render(<DataGrid columns={columns} rows={[{ id: 4, name: 'Ada', age: 36 }]} />)
  expect(cellsOf(bodyRows()[0])).toEqual(['Ada', '36 yrs'])
})

test('every row has the same number of cells', () => {
  render(
    <DataGrid
      columns={COLUMNS}
      rows={[
        { id: 1, name: 'Ada' },
        { id: 2, name: 'Marie', city: 'Paris', age: 41 },
      ]}
    />,
  )
  expect(bodyRows().map((row) => cellsOf(row).length)).toEqual([3, 3])
})
