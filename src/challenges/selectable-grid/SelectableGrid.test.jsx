import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import SelectableGrid from './SelectableGrid'

const setup = (rows = 4, cols = 4) => render(<SelectableGrid rows={rows} cols={cols} />)

const cell = (row, col) => screen.getByRole('gridcell', { name: `Cell ${row},${col}` })
const click = (row, col, modifiers = {}) => fireEvent.click(cell(row, col), modifiers)
const selected = () =>
  screen
    .getAllByTestId('cell')
    .filter((c) => c.dataset.selected === 'true')
    .map((c) => c.dataset.cell)
const count = () => screen.getByTestId('count').textContent

test('renders a grid of cells', () => {
  setup(3, 4)
  expect(screen.getAllByTestId('cell')).toHaveLength(12)
})

test('nothing is selected to start', () => {
  setup()
  expect(selected()).toEqual([])
  expect(count()).toBe('0 selected')
})

test('a plain click selects one cell', () => {
  setup()
  click(1, 1)

  expect(selected()).toEqual(['1:1'])
})

test('a plain click clears whatever was selected before', () => {
  setup()
  click(1, 1)
  click(2, 2)

  expect(selected()).toEqual(['2:2'])
})

test('shift+click selects the rectangle from the last click', () => {
  setup()
  click(1, 1)
  click(2, 2, { shiftKey: true })

  expect(selected()).toEqual(['1:1', '1:2', '2:1', '2:2'])
})

test('the rectangle works backwards too', () => {
  setup()
  click(2, 2)
  click(1, 1, { shiftKey: true })

  expect(selected()).toEqual(['1:1', '1:2', '2:1', '2:2'])
})

test('a single row is a valid rectangle', () => {
  setup()
  click(0, 0)
  click(0, 3, { shiftKey: true })

  expect(selected()).toEqual(['0:0', '0:1', '0:2', '0:3'])
})

test('a second shift+click re-measures from the same anchor', () => {
  setup()
  click(1, 1)
  click(3, 3, { shiftKey: true })
  click(1, 2, { shiftKey: true })

  expect(selected()).toEqual(['1:1', '1:2'])
})

test('shift+click with nothing selected yet just selects that cell', () => {
  setup()
  click(2, 2, { shiftKey: true })

  expect(selected()).toEqual(['2:2'])
})

test('ctrl+click adds one cell without clearing the rest', () => {
  setup()
  click(0, 0)
  click(3, 3, { ctrlKey: true })

  expect(selected()).toEqual(['0:0', '3:3'])
})

test('ctrl+click on a selected cell removes it', () => {
  setup()
  click(0, 0)
  click(3, 3, { ctrlKey: true })
  click(0, 0, { ctrlKey: true })

  expect(selected()).toEqual(['3:3'])
})

test('ctrl+click moves the anchor for the next shift+click', () => {
  setup()
  click(0, 0)
  click(2, 2, { ctrlKey: true })
  click(2, 3, { shiftKey: true })

  expect(selected()).toEqual(['2:2', '2:3'])
})

test('the count keeps up', () => {
  setup()
  click(0, 0)
  click(2, 2, { shiftKey: true })

  expect(count()).toBe('9 selected')
})
