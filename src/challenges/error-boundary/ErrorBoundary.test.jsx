import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

// React logs caught render errors. Keep the test output readable.
let quiet
beforeEach(() => {
  quiet = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => quiet.mockRestore())

function Boom({ when = true, message = 'kaboom' }) {
  if (when) throw new Error(message)
  return <p>no error here</p>
}

test('renders children when nothing throws', () => {
  render(
    <ErrorBoundary fallback={<p>fallback</p>}>
      <p>all good</p>
    </ErrorBoundary>,
  )

  expect(screen.getByText('all good')).toBeInTheDocument()
  expect(screen.queryByText('fallback')).not.toBeInTheDocument()
})

test('swaps in the fallback when a child throws', () => {
  render(
    <ErrorBoundary fallback={<p>fallback</p>}>
      <Boom />
    </ErrorBoundary>,
  )

  expect(screen.getByText('fallback')).toBeInTheDocument()
})

test('a function fallback receives the error', () => {
  render(
    <ErrorBoundary fallback={(error) => <p>caught: {error.message}</p>}>
      <Boom message="disk on fire" />
    </ErrorBoundary>,
  )

  expect(screen.getByText(/caught: disk on fire/)).toBeInTheDocument()
})

test('onError is called once with the error', () => {
  const onError = vi.fn()
  render(
    <ErrorBoundary fallback={<p>fallback</p>} onError={onError}>
      <Boom message="reported" />
    </ErrorBoundary>,
  )

  expect(onError).toHaveBeenCalledTimes(1)
  expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
  expect(onError.mock.calls[0][0].message).toBe('reported')
})

// Reads the flag at ITS OWN render time, so flipping it then re-rendering works.
function Flaky({ flag, message = 'again' }) {
  if (flag.throws) throw new Error(message)
  return <p>no error here</p>
}

test('reset re-renders the children', async () => {
  const flag = { throws: true }
  const retry = () => screen.getByRole('button', { name: /try again/i })

  render(
    <ErrorBoundary
      fallback={(error, reset) => (
        <button
          onClick={() => {
            flag.throws = false
            reset()
          }}
        >
          Try again
        </button>
      )}
    >
      <Flaky flag={flag} />
    </ErrorBoundary>,
  )

  expect(retry()).toBeInTheDocument()

  await userEvent.click(retry())
  expect(screen.getByText('no error here')).toBeInTheDocument()
})

test('the boundary catches again after a reset', async () => {
  const flag = { throws: true }
  const retry = () => screen.getByRole('button', { name: /retry again/i })

  render(
    <ErrorBoundary
      fallback={(error, reset) => <button onClick={reset}>retry {error.message}</button>}
    >
      <Flaky flag={flag} />
    </ErrorBoundary>,
  )

  expect(retry()).toBeInTheDocument()

  // reset while the child still throws — the boundary must catch a second time
  await userEvent.click(retry())
  expect(retry()).toBeInTheDocument()

  flag.throws = false
  await userEvent.click(retry())
  expect(screen.getByText('no error here')).toBeInTheDocument()
})
