import { render, screen } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { clearQueryCache, useQuery } from './useQuery'

beforeEach(() => clearQueryCache())

const Probe = ({ id, fetcher }) => {
  const { status, data, error } = useQuery(id, fetcher)
  return <p data-testid="out">{status === 'error' ? error.message : (data ?? status)}</p>
}

const out = () => screen.getByTestId('out').textContent
const after = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms))
const loader = (delay = 1) => vi.fn((id) => after(delay, `data for ${id}`))

test('starts out loading', () => {
  render(<Probe id="a" fetcher={loader()} />)
  expect(out()).toBe('loading')
})

test('lands on the data', async () => {
  render(<Probe id="a" fetcher={loader()} />)
  expect(await screen.findByText('data for a')).toBeInTheDocument()
})

test('a rejection lands on the error', async () => {
  const fetcher = vi.fn(() => Promise.reject(new Error('offline')))
  render(<Probe id="a" fetcher={fetcher} />)

  expect(await screen.findByText('offline')).toBeInTheDocument()
})

test('the fetcher gets the key', async () => {
  const fetcher = loader()
  render(<Probe id="user-7" fetcher={fetcher} />)
  await screen.findByText('data for user-7')

  expect(fetcher).toHaveBeenCalledWith('user-7')
})

test('a cached key does not fetch again', async () => {
  const fetcher = loader()
  const first = render(<Probe id="a" fetcher={fetcher} />)
  await screen.findByText('data for a')
  first.unmount()

  render(<Probe id="a" fetcher={fetcher} />)
  expect(fetcher).toHaveBeenCalledTimes(1)
})

test('a cached key renders its data straight away, with no loading flash', async () => {
  const fetcher = loader()
  const first = render(<Probe id="a" fetcher={fetcher} />)
  await screen.findByText('data for a')
  first.unmount()

  render(<Probe id="a" fetcher={fetcher} />)
  expect(out()).toBe('data for a')
})

test('a different key is a different query', async () => {
  const fetcher = loader()
  const view = render(<Probe id="a" fetcher={fetcher} />)
  await screen.findByText('data for a')

  view.rerender(<Probe id="b" fetcher={fetcher} />)
  expect(await screen.findByText('data for b')).toBeInTheDocument()
  expect(fetcher).toHaveBeenCalledTimes(2)
})

test('switching to an uncached key goes back to loading', async () => {
  const fetcher = loader(20)
  const view = render(<Probe id="a" fetcher={fetcher} />)
  await screen.findByText('data for a')

  view.rerender(<Probe id="b" fetcher={fetcher} />)
  expect(out()).toBe('loading')
})

test('a slow response for an abandoned key is ignored', async () => {
  const fetcher = vi.fn((id) => after(id === 'slow' ? 40 : 1, `data for ${id}`))
  const view = render(<Probe id="slow" fetcher={fetcher} />)

  view.rerender(<Probe id="fast" fetcher={fetcher} />)
  await screen.findByText('data for fast')

  await after(80)
  expect(out()).toBe('data for fast')
})

test('unmounting before the response does not blow up', async () => {
  const view = render(<Probe id="a" fetcher={loader(20)} />)
  view.unmount()

  await expect(after(40)).resolves.toBe(undefined)
})
