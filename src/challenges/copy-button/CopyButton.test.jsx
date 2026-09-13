import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import CopyButton from './CopyButton'

function controllable() {
  const calls = []
  let settle
  const write = (t) => {
    calls.push(t)
    return new Promise((resolve, reject) => {
      settle = { resolve, reject }
    })
  }
  return {
    calls,
    write,
    resolve: () => act(async () => settle.resolve()),
    reject: () => act(async () => settle.reject(new Error('denied'))),
  }
}

const button = () => screen.getByRole('button')

test('starts as Copy and writes the text once', async () => {
  const api = controllable()
  render(<CopyButton text="sk-123" write={api.write} resetAfter={5000} />)
  expect(button()).toHaveTextContent('Copy')

  await userEvent.click(button())
  expect(api.calls).toEqual(['sk-123'])
})

test('it does not claim success until the write settles', async () => {
  const api = controllable()
  render(<CopyButton text="sk-123" write={api.write} resetAfter={5000} />)

  await userEvent.click(button())
  expect(button()).toHaveTextContent('Copy')
  expect(button()).not.toHaveTextContent('Copied')
})

test('a resolved write says Copied', async () => {
  const api = controllable()
  render(<CopyButton text="sk-123" write={api.write} resetAfter={5000} />)

  await userEvent.click(button())
  await api.resolve()
  expect(button()).toHaveTextContent('Copied')
  expect(screen.getByRole('status')).toHaveTextContent('Copied')
})

test('it goes back to Copy on its own', async () => {
  const api = controllable()
  render(<CopyButton text="sk-123" write={api.write} resetAfter={10} />)

  await userEvent.click(button())
  await api.resolve()
  expect(await screen.findByRole('button', { name: 'Copy' })).toBeInTheDocument()
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
})

test('a rejected write says so, and never says Copied', async () => {
  const api = controllable()
  render(<CopyButton text="sk-123" write={api.write} resetAfter={5000} />)

  await userEvent.click(button())
  await api.reject()
  expect(button()).toHaveTextContent('Copy failed')
  expect(screen.getByRole('status')).toHaveTextContent('Copy failed')
})

test('the failure resets itself too', async () => {
  const api = controllable()
  render(<CopyButton text="sk-123" write={api.write} resetAfter={10} />)

  await userEvent.click(button())
  await api.reject()
  expect(await screen.findByRole('button', { name: 'Copy' })).toBeInTheDocument()
})

test('the status region is empty before anything happens', () => {
  const api = controllable()
  render(<CopyButton text="sk-123" write={api.write} />)
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
})
