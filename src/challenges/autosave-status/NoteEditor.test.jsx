import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import NoteEditor from './NoteEditor'

// The delay is injected rather than faked, so this reads the same under both
// runners. 30ms is long enough to be a wait and short enough not to be one.
const DELAY = 30

const box = () => screen.getByLabelText('Note')

const recorder = (behaviour = () => Promise.resolve()) => {
  const calls = []
  return {
    calls,
    save: (text) => {
      calls.push(text)
      return behaviour(text)
    },
  }
}

test('starts up to date', () => {
  const r = recorder()
  render(<NoteEditor save={r.save} delay={DELAY} />)
  expect(screen.getByText('Up to date')).toBeInTheDocument()
})

test('typing says so at once', async () => {
  const r = recorder()
  render(<NoteEditor save={r.save} delay={DELAY} />)
  await userEvent.type(box(), 'a')
  expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
  expect(r.calls).toEqual([])
})

test('it saves what was typed once the typing stops', async () => {
  const r = recorder()
  render(<NoteEditor save={r.save} delay={DELAY} />)
  await userEvent.type(box(), 'hello')
  expect(await screen.findByText('Up to date')).toBeInTheDocument()
  expect(r.calls).toEqual(['hello'])
})

test('five letters are one save, not five', async () => {
  const r = recorder()
  render(<NoteEditor save={r.save} delay={DELAY} />)
  await userEvent.type(box(), 'hello')
  await screen.findByText('Up to date')
  expect(r.calls).toHaveLength(1)
})

test('a failure says so', async () => {
  const r = recorder(() => Promise.reject(new Error('nope')))
  render(<NoteEditor save={r.save} delay={DELAY} />)
  await userEvent.type(box(), 'hi')
  expect(await screen.findByText('Could not save')).toBeInTheDocument()
})

test('typing after a failure tries again', async () => {
  let fail = true
  const r = recorder(() =>
    fail ? Promise.reject(new Error('nope')) : Promise.resolve(),
  )
  render(<NoteEditor save={r.save} delay={DELAY} />)
  await userEvent.type(box(), 'hi')
  await screen.findByText('Could not save')

  fail = false
  await userEvent.type(box(), '!')
  expect(await screen.findByText('Up to date')).toBeInTheDocument()
  expect(r.calls).toEqual(['hi', 'hi!'])
})

test('the box keeps what you typed throughout', async () => {
  const r = recorder()
  render(<NoteEditor save={r.save} delay={DELAY} />)
  await userEvent.type(box(), 'hello')
  await screen.findByText('Up to date')
  expect(box()).toHaveValue('hello')
})
