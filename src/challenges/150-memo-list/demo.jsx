// Preview harness, not part of the challenge. Renders ItemList with sample
// props so you can click it in the browser. Stays blank until the stub renders
// something.
import ItemList from './ItemList'

const items = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  label: `Item ${i}`,
}))

export default function Demo() {
  return (
    <div style={{ font: '14px system-ui', padding: 16 }}>
      <strong>09 — memo-list</strong>
      <div style={{ border: '1px dashed #888', marginTop: 8, padding: 8 }}>
        <ItemList
          items={items}
          onPick={(id) => console.log('picked', id)}
          onRender={() => {}}
        />
      </div>
    </div>
  )
}
