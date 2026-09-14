import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TagFilter from './TagFilter'

const ITEMS = [
  { id: 1, title: 'Hooks post', tags: ['react', 'hooks'] },
  { id: 2, title: 'Effects post', tags: ['react', 'hooks', 'async'] },
  { id: 3, title: 'CSS post', tags: ['css'] },
  { id: 4, title: 'React and CSS', tags: ['react', 'css'] },
]

const setup = (items = ITEMS) => ({
  user: userEvent.setup(),
  ...render(<TagFilter items={items} />),
})

const tags = () =>
  screen.getAllByTestId('tag').map((b) => b.textContent.replace(/\s+/g, ' ').trim())
const titles = () => screen.queryAllByTestId('item').map((li) => li.textContent)
const tag = (name) => screen.getByRole('button', { name: new RegExp(`^${name}\\b`) })

test('every tag appears once, in the order it first turns up', () => {
  setup()
  expect(tags()).toEqual(['react 3', 'hooks 2', 'async 1', 'css 2'])
})

test('nothing selected shows everything', () => {
  setup()
  expect(titles()).toHaveLength(4)
})

test('picking a tag narrows the list', async () => {
  const { user } = setup()
  await user.click(tag('react'))

  expect(titles()).toEqual(['Hooks post', 'Effects post', 'React and CSS'])
  expect(tag('react')).toHaveAttribute('aria-pressed', 'true')
})

test('two tags means both, not either', async () => {
  const { user } = setup()
  await user.click(tag('react'))
  await user.click(tag('hooks'))

  expect(titles()).toEqual(['Hooks post', 'Effects post'])
})

test('clicking a picked tag lets it go again', async () => {
  const { user } = setup()
  await user.click(tag('react'))
  await user.click(tag('react'))

  expect(titles()).toHaveLength(4)
  expect(tag('react')).toHaveAttribute('aria-pressed', 'false')
})

test('a tag that would leave nothing is out of reach', async () => {
  const { user } = setup()
  await user.click(tag('react'))
  await user.click(tag('hooks'))

  expect(tag('css')).toBeDisabled()
  expect(tag('hooks')).toBeEnabled()
})

test('the counts are about what is left, not about the whole list', async () => {
  const { user } = setup()
  await user.click(tag('react'))

  expect(tags()).toEqual(['react 3', 'hooks 2', 'async 1', 'css 1'])
})
