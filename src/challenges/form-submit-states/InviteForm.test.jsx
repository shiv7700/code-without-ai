import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import InviteForm from './InviteForm'

// Nothing settles until the test says so, which is the only way to look at the
// form while the request is still in the air.
function controllable() {
  let settle = {}
  let calls = 0
  const onSubmit = (value) => {
    calls += 1
    return new Promise((resolve, reject) => {
      settle = { resolve, reject }
    })
  }
  return {
    onSubmit,
    calls: () => calls,
    ok: () => act(async () => settle.resolve()),
    fail: (message) => act(async () => settle.reject(new Error(message))),
  }
}

const field = () => screen.getByLabelText('Email')
const button = () => screen.getByRole('button')

test('starts idle', () => {
  const t = controllable()
  render(<InviteForm onSubmit={t.onSubmit} />)
  expect(button()).toHaveTextContent('Send')
  expect(button()).toBeEnabled()
})

test('the button says so while it is in flight', async () => {
  const t = controllable()
  render(<InviteForm onSubmit={t.onSubmit} />)
  await userEvent.type(field(), 'ada@example.com')
  await userEvent.click(button())
  expect(button()).toHaveTextContent('Sending…')
  expect(button()).toBeDisabled()
})

test('a second click while in flight does nothing', async () => {
  const t = controllable()
  render(<InviteForm onSubmit={t.onSubmit} />)
  await userEvent.type(field(), 'ada@example.com')
  await userEvent.click(button())
  await userEvent.click(button())
  expect(t.calls()).toBe(1)
})

test('success empties the box and says so', async () => {
  const t = controllable()
  render(<InviteForm onSubmit={t.onSubmit} />)
  await userEvent.type(field(), 'ada@example.com')
  await userEvent.click(button())
  await t.ok()
  expect(field()).toHaveValue('')
  expect(screen.getByText('Invite sent')).toBeInTheDocument()
  expect(button()).toHaveTextContent('Send')
  expect(button()).toBeEnabled()
})

test('failure keeps what was typed', async () => {
  const t = controllable()
  render(<InviteForm onSubmit={t.onSubmit} />)
  await userEvent.type(field(), 'ada@example.com')
  await userEvent.click(button())
  await t.fail('Already invited')
  expect(field()).toHaveValue('ada@example.com')
})

test("failure shows the error's own message and frees the button", async () => {
  const t = controllable()
  render(<InviteForm onSubmit={t.onSubmit} />)
  await userEvent.type(field(), 'ada@example.com')
  await userEvent.click(button())
  await t.fail('Already invited')
  expect(screen.getByText('Already invited')).toBeInTheDocument()
  expect(button()).toBeEnabled()
  expect(screen.queryByText('Invite sent')).not.toBeInTheDocument()
})

test('trying again clears the old error', async () => {
  const t = controllable()
  render(<InviteForm onSubmit={t.onSubmit} />)
  await userEvent.type(field(), 'ada@example.com')
  await userEvent.click(button())
  await t.fail('Already invited')
  await userEvent.click(button())
  expect(screen.queryByText('Already invited')).not.toBeInTheDocument()
})
