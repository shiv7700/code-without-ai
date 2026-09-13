import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import KeyboardAccordion from './KeyboardAccordion'

const ITEMS = [
  { id: 'a', title: 'One', body: <input aria-label="Note" /> },
  { id: 'b', title: 'Two', body: <p>Body two</p> },
  { id: 'c', title: 'Three', body: <p>Body three</p> },
]

const head = (name) => screen.getByRole('button', { name })

test('ArrowDown walks forward through the headers', async () => {
  render(<KeyboardAccordion items={ITEMS} />)
  head('One').focus()

  await userEvent.keyboard('{ArrowDown}')
  expect(head('Two')).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  expect(head('Three')).toHaveFocus()
})

test('ArrowUp walks back', async () => {
  render(<KeyboardAccordion items={ITEMS} />)
  head('Three').focus()

  await userEvent.keyboard('{ArrowUp}')
  expect(head('Two')).toHaveFocus()
})

test('the ends wrap round', async () => {
  render(<KeyboardAccordion items={ITEMS} />)

  head('Three').focus()
  await userEvent.keyboard('{ArrowDown}')
  expect(head('One')).toHaveFocus()

  await userEvent.keyboard('{ArrowUp}')
  expect(head('Three')).toHaveFocus()
})

test('Home and End go to the ends', async () => {
  render(<KeyboardAccordion items={ITEMS} />)
  head('Two').focus()

  await userEvent.keyboard('{End}')
  expect(head('Three')).toHaveFocus()

  await userEvent.keyboard('{Home}')
  expect(head('One')).toHaveFocus()
})

test('moving between headers opens nothing', async () => {
  render(<KeyboardAccordion items={ITEMS} />)
  head('One').focus()

  await userEvent.keyboard('{ArrowDown}{ArrowDown}{Home}{End}')
  expect(screen.queryByText('Body two')).toBeNull()
  screen.getAllByRole('button').forEach((b) => {
    expect(b).toHaveAttribute('aria-expanded', 'false')
  })
})

test('arrow keys inside an open panel do not steal focus', async () => {
  render(<KeyboardAccordion items={ITEMS} />)

  await userEvent.click(head('One'))
  const note = screen.getByLabelText('Note')
  note.focus()

  await userEvent.keyboard('{ArrowDown}{ArrowUp}{Home}{End}')
  expect(note).toHaveFocus()
})
