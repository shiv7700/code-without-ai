import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'
import ChipsInput from './ChipsInput'

function Host({ initial = [] }) {
  const [value, setValue] = useState(initial)
  return <ChipsInput value={value} onChange={setValue} />
}

const box = () => screen.getByLabelText('Tags')
const chips = () =>
  screen.getAllByRole('listitem').map((li) => li.textContent.replace(/Remove.*/, ''))

test('shows the chosen tags as a named list', () => {
  render(<Host initial={['react', 'jsx']} />)

  expect(screen.getByRole('list')).toHaveAccessibleName('Selected tags')
  expect(chips()).toEqual(['react', 'jsx'])
})

test('Enter adds the tag and empties the box', async () => {
  render(<Host />)

  await userEvent.type(box(), 'react{Enter}')
  expect(chips()).toEqual(['react'])
  expect(box()).toHaveValue('')
})

test('blank and duplicate entries add nothing', async () => {
  render(<Host initial={['react']} />)

  await userEvent.type(box(), '   {Enter}')
  await userEvent.type(box(), 'react{Enter}')

  expect(chips()).toEqual(['react'])
  expect(box()).toHaveValue('')
})

test('a chip is removed by its own button, and the box keeps the focus', async () => {
  render(<Host initial={['react', 'jsx']} />)
  box().focus()

  await userEvent.click(screen.getByRole('button', { name: 'Remove react' }))

  expect(chips()).toEqual(['jsx'])
  expect(box()).toHaveFocus()
})

test('a parent that ignores onChange leaves the tags alone', async () => {
  render(<ChipsInput value={['react']} onChange={() => {}} />)

  await userEvent.click(screen.getByRole('button', { name: 'Remove react' }))
  expect(chips()).toEqual(['react'])
})

test('Backspace only eats a tag once the box is empty', async () => {
  render(<Host initial={['react', 'jsx']} />)

  await userEvent.type(box(), 'ts')
  await userEvent.keyboard('{Backspace}{Backspace}')

  expect(box()).toHaveValue('')
  expect(chips()).toEqual(['react', 'jsx'])

  await userEvent.keyboard('{Backspace}')
  expect(chips()).toEqual(['react'])
})
