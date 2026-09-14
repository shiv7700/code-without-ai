import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import TodoFilters from './TodoFilters'

const TODOS = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Walk dog', done: true },
  { id: 3, title: 'Write tests', done: false },
]

const setup = (path = '/') => {
  const onNavigate = vi.fn()
  const view = render(
    <TodoFilters todos={TODOS} path={path} onNavigate={onNavigate} />,
  )
  return {
    onNavigate,
    user: userEvent.setup(),
    go: (next) =>
      view.rerender(
        <TodoFilters todos={TODOS} path={next} onNavigate={onNavigate} />,
      ),
  }
}

const titles = () =>
  screen.queryAllByRole('listitem').map((li) => li.textContent.trim())

test('the root path shows the lot', () => {
  setup()
  expect(titles()).toEqual(['Buy milk', 'Walk dog', 'Write tests'])
})

test('a path nobody recognises shows the lot as well', () => {
  setup('/rubbish')
  expect(titles()).toEqual(['Buy milk', 'Walk dog', 'Write tests'])
})

test('the active path leaves out what is finished', () => {
  setup('/active')
  expect(titles()).toEqual(['Buy milk', 'Write tests'])
})

test('the filter you arrived on is the one marked', () => {
  setup('/done')
  expect(screen.getByRole('button', { name: 'Done' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(screen.getByRole('button', { name: 'All' })).not.toHaveAttribute(
    'aria-current',
  )
})

test('ticking a todo moves it out of the active list', async () => {
  const { user } = setup('/active')
  await user.click(screen.getByLabelText('Buy milk'))

  expect(titles()).toEqual(['Write tests'])
})

test('a tick survives a trip to another filter and back', async () => {
  const { user, go } = setup('/')
  await user.click(screen.getByLabelText('Buy milk'))
  go('/done')

  expect(titles()).toEqual(['Buy milk', 'Walk dog'])
})

test('clicking a filter asks to go there, it does not go there itself', async () => {
  const { user, onNavigate } = setup('/')
  await user.click(screen.getByRole('button', { name: 'Active' }))

  expect(onNavigate).toHaveBeenCalledWith('/active')
  expect(titles()).toEqual(['Buy milk', 'Walk dog', 'Write tests'])
})

test('the list follows whatever path it is handed next', () => {
  const { go } = setup('/')
  go('/done')

  expect(titles()).toEqual(['Walk dog'])
})
