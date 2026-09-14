import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import ClearableSearch from './ClearableSearch'

function Host({ initial = '', onSubmit = () => {} }) {
  const [value, setValue] = useState(initial)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <ClearableSearch value={value} onChange={setValue} />
    </form>
  )
}

const field = () => screen.getByLabelText('Search')
const clear = () => screen.getByRole('button', { name: 'Clear search' })

test('renders a labelled search box holding the value', () => {
  render(<ClearableSearch value="shoes" onChange={() => {}} />)

  expect(field()).toHaveValue('shoes')
  expect(field()).toHaveAttribute('type', 'search')
})

test('there is nothing to clear while it is empty', () => {
  render(<ClearableSearch value="" onChange={() => {}} label="Filter" />)

  expect(screen.getByLabelText('Filter')).toBeInTheDocument()
  expect(screen.queryByRole('button')).toBeNull()
})

test('typing reports every keystroke', async () => {
  const onChange = vi.fn()
  render(<ClearableSearch value="" onChange={onChange} />)

  await userEvent.type(field(), 'a')
  expect(onChange).toHaveBeenCalledWith('a')
})

test('the clear button empties the value', async () => {
  render(<Host initial="shoes" />)

  await userEvent.click(clear())
  expect(field()).toHaveValue('')
})

test('Escape clears it too', async () => {
  render(<Host initial="shoes" />)

  await userEvent.type(field(), '{Escape}')
  expect(field()).toHaveValue('')
})

test('clearing leaves the caret where the user left it', async () => {
  render(<Host initial="shoes" />)
  field().focus()

  await userEvent.click(clear())
  expect(field()).toHaveFocus()
})

test('clearing does not submit the surrounding form', async () => {
  const onSubmit = vi.fn()
  render(<Host initial="shoes" onSubmit={onSubmit} />)

  await userEvent.click(clear())
  expect(onSubmit).not.toHaveBeenCalled()
})
