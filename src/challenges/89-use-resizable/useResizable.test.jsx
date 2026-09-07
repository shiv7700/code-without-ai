import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useResizable } from './useResizable'

function setup(options = { initial: 200, min: 100, max: 400 }) {
  const Probe = () => {
    const { size, dragging, onMouseDown } = useResizable(options)
    return (
      <div>
        <div data-testid="pane" style={{ width: size }} />
        <div data-testid="handle" data-dragging={dragging} onMouseDown={onMouseDown} />
      </div>
    )
  }
  const view = render(<Probe />)

  return {
    ...view,
    width: () => Number.parseInt(screen.getByTestId('pane').style.width, 10),
    dragging: () => screen.getByTestId('handle').dataset.dragging === 'true',
    grab: (clientX) => fireEvent.mouseDown(screen.getByTestId('handle'), { clientX }),
    move: (clientX) => fireEvent.mouseMove(document, { clientX }),
    release: () => fireEvent.mouseUp(document),
  }
}

test('starts at the initial size', () => {
  expect(setup().width()).toBe(200)
})

test('moving the mouse without grabbing changes nothing', () => {
  const p = setup()
  p.move(500)

  expect(p.width()).toBe(200)
})

test('dragging resizes by the distance travelled', () => {
  const p = setup()
  p.grab(300)
  p.move(350)

  expect(p.width()).toBe(250)
})

test('dragging back the other way shrinks it', () => {
  const p = setup()
  p.grab(300)
  p.move(250)

  expect(p.width()).toBe(150)
})

test('the size follows the pointer, it does not accumulate per move', () => {
  const p = setup()
  p.grab(300)
  p.move(320)
  p.move(340)

  expect(p.width()).toBe(240)
})

test('it stops at the maximum', () => {
  const p = setup()
  p.grab(300)
  p.move(900)

  expect(p.width()).toBe(400)
})

test('it stops at the minimum', () => {
  const p = setup()
  p.grab(300)
  p.move(0)

  expect(p.width()).toBe(100)
})

test('it reports whether a drag is in progress', () => {
  const p = setup()
  expect(p.dragging()).toBe(false)

  p.grab(300)
  expect(p.dragging()).toBe(true)

  p.release()
  expect(p.dragging()).toBe(false)
})

test('letting go stops the resizing', () => {
  const p = setup()
  p.grab(300)
  p.move(350)
  p.release()
  p.move(900)

  expect(p.width()).toBe(250)
})

test('a second drag starts from where the first one left off', () => {
  const p = setup()
  p.grab(300)
  p.move(350)
  p.release()

  p.grab(0)
  p.move(20)
  expect(p.width()).toBe(270)
})

test('unmounting removes the document listeners', () => {
  const p = setup()
  p.grab(300)
  p.unmount()

  expect(() => fireEvent.mouseMove(document, { clientX: 900 })).not.toThrow()
})
