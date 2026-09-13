import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SearchForm from './SearchForm'

const field = () => screen.getByLabelText('Query')
const search = () => screen.getByRole('button', { name: 'Search' })

test('the input is controlled', async () => {
  render(<SearchForm onSearch={() => {}} />)

  await userEvent.type(field(), 'cats')
  expect(field()).toHaveValue('cats')
})

test('clicking Search reports the query and empties the field', async () => {
  const onSearch = vi.fn()
  render(<SearchForm onSearch={onSearch} />)

  await userEvent.type(field(), '  cats  ')
  await userEvent.click(search())

  expect(onSearch).toHaveBeenCalledWith('cats')
  expect(field()).toHaveValue('')
})

test('a whitespace-only query reports nothing', async () => {
  const onSearch = vi.fn()
  render(<SearchForm onSearch={onSearch} />)

  await userEvent.type(field(), '   ')
  await userEvent.click(search())

  expect(onSearch).not.toHaveBeenCalled()
})

test('Enter inside the field submits too', async () => {
  const onSearch = vi.fn()
  render(<SearchForm onSearch={onSearch} />)

  await userEvent.type(field(), 'dogs{enter}')

  expect(onSearch).toHaveBeenCalledWith('dogs')
  expect(field()).toHaveValue('')
})

test('the page is never asked to reload', async () => {
  render(<SearchForm onSearch={() => {}} />)

  let prevented = null
  const watch = (e) => {
    prevented = e.defaultPrevented
  }
  document.addEventListener('submit', watch)
  await userEvent.type(field(), 'birds{enter}')
  document.removeEventListener('submit', watch)

  expect(prevented).toBe(true)
})
