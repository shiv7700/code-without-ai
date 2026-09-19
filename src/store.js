// One row per user per challenge, holding both the code and whether it passes.
// RLS keeps you to your own rows, so nothing here filters by user on read.
import { supabase } from './supabase'

const TABLE = 'solutions'

// The row still holds one text column. One file is written as its own source,
// exactly as before, so every row saved until now loads untouched; more than
// one is written as a JSON map of path to source.
const isFileMap = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.keys(value).length > 0 &&
  Object.keys(value).every((k) => k.startsWith('/')) &&
  Object.values(value).every((v) => typeof v === 'string')

export const encodeFiles = (files) => {
  const paths = Object.keys(files)
  return paths.length === 1 ? files[paths[0]] : JSON.stringify(files)
}

// `primary` is where a single stored file goes. Anything that does not parse
// as a map of paths is treated as one file, which also covers a saved solution
// that happens to begin with a brace.
export const decodeFiles = (code, primary) => {
  if (typeof code !== 'string') return {}
  try {
    const parsed = JSON.parse(code)
    if (isFileMap(parsed)) return parsed
  } catch {
    // not JSON — one file, the old shape
  }
  return { [primary]: code }
}

const userId = async () =>
  (await supabase.auth.getSession()).data.session?.user?.id

// The home screen only needs the names, not ninety blobs of code.
export const loadProgress = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('challenge')
    .eq('passed', true)

  if (error) throw error
  return new Set(data.map((row) => row.challenge))
}

export const loadSolution = async (challenge) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('code, passed')
    .eq('challenge', challenge)
    .maybeSingle()

  if (error) throw error
  return data
}

// user_id is sent rather than left to its column default: upsert needs the
// conflict target present in the row it tries to insert.
export const saveSolution = async (challenge, fields) => {
  const user_id = await userId()
  if (!user_id) return

  const { error } = await supabase.from(TABLE).upsert(
    { user_id, challenge, ...fields, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,challenge' },
  )
  if (error) throw error
}

export const saveCode = (challenge, files) =>
  saveSolution(challenge, { code: encodeFiles(files) })

export const saveDone = (challenge, passed) =>
  saveSolution(challenge, { passed })
