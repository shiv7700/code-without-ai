import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)

// jsdom has the element but throws "not implemented" on both methods, and the
// app's Dialog is built on the native one. Stand-ins that only track the flag —
// the focus trap and top layer are the browser's job and are not under test.
HTMLDialogElement.prototype.showModal = function () {
  this.open = true
}
HTMLDialogElement.prototype.close = function () {
  if (!this.open) return
  this.open = false
  this.dispatchEvent(new Event('close'))
}

// Node 25 ships a stub `localStorage` global that shadows jsdom's and is missing
// most of the Storage API (no clear, no key, no length). Replace it with a real
// in-memory one so the storage challenges behave like a browser.
const store = new Map()
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  writable: true,
  value: {
    getItem: (k) => (store.has(String(k)) ? store.get(String(k)) : null),
    setItem: (k, v) => void store.set(String(k), String(v)),
    removeItem: (k) => void store.delete(String(k)),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i] ?? null,
    get length() {
      return store.size
    },
  },
})
