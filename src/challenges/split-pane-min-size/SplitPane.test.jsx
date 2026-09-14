import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import SplitPane from './SplitPane'

const bar = () => screen.getByRole('separator')
const size = () => Number(bar().getAttribute('aria-valuenow'))

const show = (props = {}) =>
  render(<SplitPane left={<p>Files</p>} right={<p>Editor</p>} {...props} />)

test('a named separator that reports where it is and how far it may go', () => {
  show()

  expect(bar()).toHaveAccessibleName('Resize panels')
  expect(bar()).toHaveAttribute('aria-orientation', 'vertical')
  expect(size()).toBe(200)
  expect(bar()).toHaveAttribute('aria-valuemin', '80')
  expect(bar()).toHaveAttribute('aria-valuemax', '320')
  expect(screen.getByText('Files')).toBeInTheDocument()
})

test('the keyboard moves it ten pixels at a time, and to the ends', async () => {
  show()
  bar().focus()

  await userEvent.keyboard('{ArrowRight}')
  expect(size()).toBe(210)

  await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
  expect(size()).toBe(190)

  await userEvent.keyboard('{End}')
  expect(size()).toBe(320)

  await userEvent.keyboard('{Home}')
  expect(size()).toBe(80)
})

test('the keyboard stops at the minimum on both sides', async () => {
  show({ initial: 90 })
  bar().focus()

  await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}')
  expect(size()).toBe(80)

  await userEvent.keyboard('{End}{ArrowRight}{ArrowRight}')
  expect(size()).toBe(320)
})

test('dragging follows the pointer across the whole page', () => {
  show()

  fireEvent.pointerDown(bar(), { clientX: 200 })
  fireEvent.pointerMove(document, { clientX: 260 })
  expect(size()).toBe(260)

  fireEvent.pointerMove(document, { clientX: 130 })
  expect(size()).toBe(130)
})

test('a drag cannot squeeze either pane below the minimum', () => {
  show()

  fireEvent.pointerDown(bar(), { clientX: 200 })
  fireEvent.pointerMove(document, { clientX: 5 })
  expect(size()).toBe(80)

  fireEvent.pointerMove(document, { clientX: 900 })
  expect(size()).toBe(320)
})

test('letting go stops it following', () => {
  show()

  fireEvent.pointerDown(bar(), { clientX: 200 })
  fireEvent.pointerMove(document, { clientX: 260 })
  fireEvent.pointerUp(document)

  fireEvent.pointerMove(document, { clientX: 100 })
  expect(size()).toBe(260)
})
