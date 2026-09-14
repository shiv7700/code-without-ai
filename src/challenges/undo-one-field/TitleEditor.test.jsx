import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TitleEditor from './TitleEditor'

const heading = () => screen.getByRole('heading').textContent
const undo = () => screen.getByRole('button', { name: 'Undo' })

const apply = async (text) => {
  await userEvent.clear(screen.getByLabelText('Title'))
  await userEvent.type(screen.getByLabelText('Title'), text)
  await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
}

test('the heading starts as the title it was given, with nothing to undo', () => {
  render(<TitleEditor initial="First draft" />)

  expect(heading()).toBe('First draft')
  expect(undo()).toBeDisabled()
})

test('Apply moves the input into the heading', async () => {
  render(<TitleEditor initial="First draft" />)

  await apply('Second draft')

  expect(heading()).toBe('Second draft')
  expect(undo()).toBeEnabled()
})

test('Undo puts the previous title back', async () => {
  render(<TitleEditor initial="First draft" />)

  await apply('Second draft')
  await userEvent.click(undo())

  expect(heading()).toBe('First draft')
})

test('only one step is remembered', async () => {
  render(<TitleEditor initial="One" />)

  await apply('Two')
  await apply('Three')
  await userEvent.click(undo())

  expect(heading()).toBe('Two')
  expect(undo()).toBeDisabled()
})

test('applying again after an undo makes it work once more', async () => {
  render(<TitleEditor initial="One" />)

  await apply('Two')
  await userEvent.click(undo())
  await apply('Three')

  expect(heading()).toBe('Three')
  await userEvent.click(undo())
  expect(heading()).toBe('One')
})
