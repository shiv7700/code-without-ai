// One row per user per challenge, holding both the code and whether it passes.
// RLS keeps you to your own rows, so nothing here filters by user on read.
import { supabase } from './supabase'

const TABLE = 'solutions'

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

export const saveCode = (challenge, code) => saveSolution(challenge, { code })

export const saveDone = (challenge, passed) =>
  saveSolution(challenge, { passed })
