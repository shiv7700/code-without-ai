import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import TagInput from './TagInput'

const field = () => screen.getByLabelText(/tag/i)
const tags = () => screen.queryAllByTestId('tag').map((t) => t.textContent)
const add = async (text) => {
  await userEvent.type(field(), `${text}{Enter}`)
}

test('starts with no tags', () => {
  render(<TagInput />)
  expect(tags()).toEqual([])
})

test('Enter commits a tag and clears the input', async () => {
  render(<TagInput />)

  await add('react')
  expect(tags()).toEqual(['react'])
  expect(field()).toHaveValue('')
})

test('keeps adding in order', async () => {
  render(<TagInput />)

  await add('react')
  await add('vue')
  expect(tags()).toEqual(['react', 'vue'])
})

test('trims surrounding whitespace', async () => {
  render(<TagInput />)

  await add('  react  ')
  expect(tags()).toEqual(['react'])
})

test('an empty entry adds nothing but still clears', async () => {
  render(<TagInput />)

  await add('   ')
  expect(tags()).toEqual([])
  expect(field()).toHaveValue('')
})

test('duplicates are rejected', async () => {
  render(<TagInput />)

  await add('react')
  await add('react')
  expect(tags()).toEqual(['react'])
})

test('Backspace on an empty input drops the last tag', async () => {
  render(<TagInput />)

  await add('react')
  await add('vue')
  await userEvent.type(field(), '{Backspace}')
  expect(tags()).toEqual(['react'])
})

test('Backspace while typing just edits the text', async () => {
  render(<TagInput />)

  await add('react')
  await userEvent.type(field(), 'vuex{Backspace}')
  expect(tags()).toEqual(['react'])
  expect(field()).toHaveValue('vue')
})

test('the remove button drops that tag', async () => {
  render(<TagInput />)

  await add('react')
  await add('vue')
  await userEvent.click(screen.getByRole('button', { name: /remove react/i }))
  expect(tags()).toEqual(['vue'])
})

test('reports the new array on every change', async () => {
  const onChange = vi.fn()
  render(<TagInput onChange={onChange} />)

  await add('react')
  expect(onChange).toHaveBeenLastCalledWith(['react'])

  await add('vue')
  expect(onChange).toHaveBeenLastCalledWith(['react', 'vue'])
})

test('a rejected duplicate reports nothing', async () => {
  const onChange = vi.fn()
  render(<TagInput onChange={onChange} />)

  await add('react')
  onChange.mockClear()
  await add('react')
  expect(onChange).not.toHaveBeenCalled()
})
