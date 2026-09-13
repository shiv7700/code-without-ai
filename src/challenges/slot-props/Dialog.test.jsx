import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Dialog from './Dialog'

test('renders a dialog wrapper', () => {
  render(<Dialog>body</Dialog>)
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})

test('a string slot renders', () => {
  render(<Dialog header="Are you sure?">body</Dialog>)
  expect(screen.getByTestId('header')).toHaveTextContent('Are you sure?')
})

test('an element slot keeps its element', () => {
  render(
    <Dialog footer={<button>Confirm</button>}>body</Dialog>,
  )
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
})

test('a slot can hold several elements', () => {
  render(
    <Dialog
      footer={
        <>
          <button>Cancel</button>
          <button>OK</button>
        </>
      }
    >
      body
    </Dialog>,
  )
  expect(screen.getAllByRole('button')).toHaveLength(2)
})

test('children land in the body', () => {
  render(<Dialog>Delete this?</Dialog>)
  expect(screen.getByTestId('body')).toHaveTextContent('Delete this?')
})

test('a slot that was not passed leaves out its element', () => {
  render(<Dialog>body</Dialog>)
  expect(screen.queryByTestId('header')).not.toBeInTheDocument()
  expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
})

test('the body element is there even with no children', () => {
  render(<Dialog header="Title" />)
  expect(screen.getByTestId('body')).toBeInTheDocument()
})
