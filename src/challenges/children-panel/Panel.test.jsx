import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Panel from './Panel'

test('renders the title', () => {
  render(<Panel title="Settings">hi</Panel>)
  expect(screen.getByRole('heading')).toHaveTextContent('Settings')
})

test('renders plain text children', () => {
  render(<Panel title="Settings">Hello there</Panel>)
  expect(screen.getByTestId('body')).toHaveTextContent('Hello there')
})

test('an element child keeps working as an element', () => {
  render(
    <Panel title="Settings">
      <button>Save</button>
    </Panel>,
  )
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
})

test('several children all render, in order', () => {
  render(
    <Panel title="Settings">
      <span>one</span>
      <span>two</span>
    </Panel>,
  )
  expect(screen.getByTestId('body').textContent).toBe('onetwo')
})

test('no children, no body element', () => {
  render(<Panel title="Settings" />)
  expect(screen.queryByTestId('body')).not.toBeInTheDocument()
})
