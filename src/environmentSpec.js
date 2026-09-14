// One spec that leans on every API the challenge specs actually use, so a gap
// in the browser runner fails here loudly instead of surfacing as an ordinary
// red run inside one challenge. A string, like the shim, because it is written
// into Sandpack's file system rather than bundled with us.
//
// The list is derived, not guessed:
//   grep -rhoE "vi\.[a-zA-Z]+"                 src/challenges/*/*.test.*
//   grep -rhoE "\.(not\.)?to[A-Z][a-zA-Z]+"    src/challenges/*/*.test.*
//   grep -rhoE "from '[^']+'"                  src/challenges/*/*.test.*
const SOURCE = `
import { afterEach, describe, expect, test, vi } from 'vitest'
import { useEffect, useRef, useState } from 'react'
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// A test that leaves the clock installed poisons every one after it.
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('vi.fn and vi.spyOn', () => {
  test('vi.fn counts calls and remembers arguments', () => {
    const spy = vi.fn()
    spy('a', 1)
    spy('b', 2)
    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledWith('a', 1)
    expect(spy).toHaveBeenLastCalledWith('b', 2)
    expect(spy.mock.calls).toEqual([['a', 1], ['b', 2]])
  })

  test('vi.fn takes an implementation and a mockReturnValue', () => {
    const doubled = vi.fn((n) => n * 2)
    expect(doubled(21)).toBe(42)

    const fixed = vi.fn()
    fixed.mockReturnValue('pinned')
    expect(fixed()).toBe('pinned')
    fixed.mockReturnValueOnce('once')
    expect(fixed()).toBe('once')
    expect(fixed()).toBe('pinned')

    const boom = vi.fn(() => {
      throw new Error('nope')
    })
    expect(boom).toThrow('nope')
  })

  test('vi.spyOn wraps a method and can be restored', () => {
    const subject = { greet: () => 'real' }
    const spy = vi.spyOn(subject, 'greet')
    expect(subject.greet()).toBe('real')
    expect(spy).toHaveBeenCalledTimes(1)

    spy.mockImplementation(() => 'faked')
    expect(subject.greet()).toBe('faked')

    spy.mockRestore()
    expect(subject.greet()).toBe('real')
  })
})

describe('fake timers', () => {
  test('advanceTimersByTime actually fires a setTimeout', () => {
    vi.useFakeTimers()
    const fired = vi.fn()
    setTimeout(fired, 100)

    vi.advanceTimersByTime(99)
    expect(fired).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(fired).toHaveBeenCalledTimes(1)
  })

  test('advanceTimersByTime keeps firing a setInterval', () => {
    vi.useFakeTimers()
    const tick = vi.fn()
    const id = setInterval(tick, 10)

    vi.advanceTimersByTime(35)
    expect(tick).toHaveBeenCalledTimes(3)

    clearInterval(id)
    vi.advanceTimersByTime(100)
    expect(tick).toHaveBeenCalledTimes(3)
  })

  test('clearTimeout cancels a pending timer', () => {
    vi.useFakeTimers()
    const fired = vi.fn()
    const id = setTimeout(fired, 10)
    clearTimeout(id)

    vi.advanceTimersByTime(1000)
    expect(fired).not.toHaveBeenCalled()
  })

  test('a timer scheduled from inside a timer still fires in the same window', () => {
    vi.useFakeTimers()
    const order = []
    setTimeout(() => {
      order.push('outer')
      setTimeout(() => order.push('inner'), 10)
    }, 10)

    vi.advanceTimersByTime(25)
    expect(order).toEqual(['outer', 'inner'])
  })

  test('advanceTimersByTimeAsync lets an awaited promise settle between timers', async () => {
    vi.useFakeTimers()
    const order = []
    setTimeout(async () => {
      order.push('first')
      await Promise.resolve()
      order.push('resolved')
    }, 10)
    setTimeout(() => order.push('second'), 20)

    await vi.advanceTimersByTimeAsync(25)
    expect(order).toEqual(['first', 'resolved', 'second'])
  })

  test('setSystemTime moves Date.now() and a bare new Date()', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))

    expect(Date.now()).toBe(1704067200000)
    expect(new Date().toISOString()).toBe('2024-01-01T00:00:00.000Z')
    // An explicit argument must still win over the fake clock.
    expect(new Date(0).getTime()).toBe(0)

    vi.advanceTimersByTime(5000)
    expect(Date.now()).toBe(1704067205000)
  })

  // If the clock were still installed this never resolves and the test times
  // out — that is the assertion.
  test('useRealTimers puts the real clock back', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    vi.useRealTimers()
    await new Promise((resolve) => setTimeout(resolve, 1))
    expect(Date.now()).toBeGreaterThan(1700000000000)
  })
})

describe('globals', () => {
  test('stubGlobal defines a global the code can reach bare', () => {
    class FakeObserver {
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    // Bare, not globalThis.X — this is how the components under test see it.
    expect(new IntersectionObserver(() => {})).toBeInstanceOf(FakeObserver)

    vi.unstubAllGlobals()
    expect(globalThis.IntersectionObserver).not.toBe(FakeObserver)
  })

  test('unstubAllGlobals restores a global that already existed', () => {
    const original = globalThis.structuredClone
    expect(typeof original).toBe('function')

    vi.stubGlobal('structuredClone', () => 'stubbed')
    expect(globalThis.structuredClone({})).toBe('stubbed')

    vi.unstubAllGlobals()
    expect(globalThis.structuredClone).toBe(original)
  })

  test('navigator properties can be redefined', () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    navigator.clipboard.writeText('hello')
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  test('window.matchMedia can be replaced with a mock', () => {
    const real = window.matchMedia
    window.matchMedia = vi.fn((query) => ({
      matches: query === '(min-width: 600px)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    expect(window.matchMedia('(min-width: 600px)').matches).toBe(true)
    window.matchMedia = real
  })

  test('localStorage does get, set, remove, clear, length and key', () => {
    localStorage.clear()
    expect(localStorage.length).toBe(0)
    expect(localStorage.getItem('missing')).toBeNull()

    localStorage.setItem('a', '1')
    localStorage.setItem('b', '2')
    expect(localStorage.getItem('a')).toBe('1')
    expect(localStorage.length).toBe(2)
    expect([localStorage.key(0), localStorage.key(1)].sort()).toEqual(['a', 'b'])

    localStorage.removeItem('a')
    expect(localStorage.getItem('a')).toBeNull()
    expect(localStorage.length).toBe(1)

    localStorage.clear()
    expect(localStorage.length).toBe(0)
  })

  test('structuredClone, AbortController and queueMicrotask are present', async () => {
    const source = { nested: { list: [1, 2, 3] } }
    const copy = structuredClone(source)
    expect(copy).toEqual(source)
    expect(copy.nested).not.toBe(source.nested)

    const controller = new AbortController()
    const aborted = vi.fn()
    controller.signal.addEventListener('abort', aborted)
    expect(controller.signal.aborted).toBe(false)
    controller.abort()
    expect(controller.signal.aborted).toBe(true)
    expect(aborted).toHaveBeenCalledTimes(1)

    const order = []
    await new Promise((resolve) => {
      queueMicrotask(() => order.push('micro'))
      queueMicrotask(() => {
        order.push('second')
        resolve()
      })
    })
    expect(order).toEqual(['micro', 'second'])
  })
})

const Fixture = ({ label = 'Ready', disabled = false }) => {
  const [text, setText] = useState('')
  return (
    <section aria-label="fixture">
      <h2 className="title heading" data-kind="header">
        {label}
      </h2>
      <p id="hint">type something</p>
      <input
        aria-label="name"
        aria-describedby="hint"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input type="checkbox" aria-label="agree" />
      <select aria-label="pick" defaultValue="one">
        <option value="one">one</option>
        <option value="two">two</option>
      </select>
      <button disabled={disabled}>Go</button>
      <ul aria-label="rows">
        <li>
          <span>row one</span>
        </li>
      </ul>
      <div data-testid="empty" />
    </section>
  )
}

describe('@testing-library/react and jest-dom', () => {
  test('render, screen and the element matchers', () => {
    render(<Fixture />)

    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
    expect(heading).toBeVisible()
    expect(heading).toHaveTextContent('Ready')
    expect(heading).toHaveClass('title', 'heading')
    expect(heading).toHaveAttribute('data-kind', 'header')

    expect(screen.getByTestId('empty')).toBeEmptyDOMElement()
    expect(screen.getByRole('button')).toBeEnabled()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByLabelText('name')).toHaveValue('')
    expect(screen.getByLabelText('pick')).toHaveValue('one')
    expect(screen.getByRole('button')).toHaveAccessibleName('Go')
    expect(screen.getByLabelText('name')).toHaveAccessibleDescription(
      'type something',
    )
    expect(screen.queryByText('nothing here')).toBeNull()
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })

  test('toBeDisabled and toHaveStyle', () => {
    render(<Fixture disabled />)
    expect(screen.getByRole('button')).toBeDisabled()

    const region = screen.getByRole('region', { name: 'fixture' })
    region.style.display = 'flex'
    expect(region).toHaveStyle({ display: 'flex' })
  })

  test('within scopes a query, toContainElement links two nodes', () => {
    render(<Fixture />)
    const list = screen.getByRole('list', { name: 'rows' })
    const row = within(list).getByText('row one')
    expect(list).toContainElement(row)
  })

  test('fireEvent drives an input', () => {
    render(<Fixture />)
    const input = screen.getByLabelText('name')
    fireEvent.change(input, { target: { value: 'typed' } })
    expect(input).toHaveValue('typed')
  })

  test('act flushes a state update, rerender and unmount work', async () => {
    const Counter = ({ step }) => {
      const [n, setN] = useState(0)
      const cleanup = useRef(null)
      useEffect(() => () => cleanup.current?.(), [])
      return <button onClick={() => setN(n + step)}>count {n}</button>
    }

    const view = render(<Counter step={1} />)
    await act(async () => {
      screen.getByRole('button').click()
    })
    expect(screen.getByRole('button')).toHaveTextContent('count 1')

    view.rerender(<Counter step={10} />)
    await act(async () => {
      screen.getByRole('button').click()
    })
    expect(screen.getByRole('button')).toHaveTextContent('count 11')

    view.unmount()
    expect(screen.queryByRole('button')).toBeNull()
  })

  test('waitFor waits for the DOM to catch up', async () => {
    const Late = () => {
      const [ready, setReady] = useState(false)
      useEffect(() => {
        const id = setTimeout(() => setReady(true), 20)
        return () => clearTimeout(id)
      }, [])
      return <p>{ready ? 'landed' : 'waiting'}</p>
    }

    render(<Late />)
    expect(screen.getByText('waiting')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('landed')).toBeInTheDocument())
  })

  test('renderHook drives a hook and reruns it', () => {
    const useSum = (n) => {
      const [extra, setExtra] = useState(0)
      return { total: n + extra, add: () => setExtra((e) => e + 1) }
    }

    const { result, rerender, unmount } = renderHook(({ n }) => useSum(n), {
      initialProps: { n: 1 },
    })
    expect(result.current.total).toBe(1)

    act(() => result.current.add())
    expect(result.current.total).toBe(2)

    rerender({ n: 10 })
    expect(result.current.total).toBe(11)
    unmount()
  })
})

// One API per test. A single "user-event works" test tells you nothing about
// which call is the broken one, and that is the whole job of this page.
describe('@testing-library/user-event', () => {
  test('click', async () => {
    const clicked = vi.fn()
    render(<button onClick={clicked}>press</button>)
    await userEvent.click(screen.getByRole('button'))
    expect(clicked).toHaveBeenCalledTimes(1)
  })

  test('type and clear', async () => {
    render(<Fixture />)
    const input = screen.getByLabelText('name')

    await userEvent.type(input, 'hello')
    expect(input).toHaveValue('hello')

    await userEvent.clear(input)
    expect(input).toHaveValue('')
  })

  test('setup() returns a session that clicks', async () => {
    const user = userEvent.setup()
    render(<Fixture />)
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  test('selectOptions', async () => {
    render(<Fixture />)
    await userEvent.selectOptions(screen.getByLabelText('pick'), 'two')
    expect(screen.getByLabelText('pick')).toHaveValue('two')
  })

  test('dblClick', async () => {
    const twice = vi.fn()
    render(<button onDoubleClick={twice}>press</button>)
    await userEvent.dblClick(screen.getByRole('button'))
    expect(twice).toHaveBeenCalledTimes(1)
  })

  test('element.focus() puts focus where a spec expects it', () => {
    render(<Fixture />)
    const input = screen.getByLabelText('name')
    input.focus()
    expect(input).toHaveFocus()
    expect(document.activeElement).toBe(input)
  })

  test('keyboard types into the focused element', async () => {
    render(<Fixture />)
    const input = screen.getByLabelText('name')
    input.focus()

    await userEvent.keyboard('abc')
    expect(input).toHaveValue('abc')
    await userEvent.keyboard('{Backspace}')
    expect(input).toHaveValue('ab')
  })

  test('keyboard sends named keys to a handler', async () => {
    const seen = []
    render(
      <input aria-label="keys" onKeyDown={(e) => seen.push(e.key)} readOnly />,
    )
    screen.getByLabelText('keys').focus()

    await userEvent.keyboard('{ArrowDown}{Enter}{Escape}')
    expect(seen).toEqual(['ArrowDown', 'Enter', 'Escape'])
  })

  test('tab moves focus to the next tab stop', async () => {
    render(
      <div>
        <input aria-label="first" />
        <input aria-label="second" />
      </div>,
    )

    await userEvent.tab()
    expect(screen.getByLabelText('first')).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByLabelText('second')).toHaveFocus()
  })

  test('hover and unhover fire pointer events', async () => {
    const entered = vi.fn()
    const left = vi.fn()
    render(
      <span onMouseEnter={entered} onMouseLeave={left}>
        target
      </span>,
    )

    await userEvent.hover(screen.getByText('target'))
    expect(entered).toHaveBeenCalled()
    await userEvent.unhover(screen.getByText('target'))
    expect(left).toHaveBeenCalled()
  })
})





`

export const ENVIRONMENT_SPEC_PATH = '/environment.test.js'

export const ENVIRONMENT_FILES = {
  [ENVIRONMENT_SPEC_PATH]: SOURCE,
}

export default SOURCE
