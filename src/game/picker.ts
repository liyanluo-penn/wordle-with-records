// Unlimited mode's answer picker (ADR-0003, milestone 1). It remembers recent
// answers so a short session doesn't repeat words. Daily mode (milestone 2)
// will add a second picker, date → word, on the same engine.

const RECENT_KEY = 'cache-hit:recent-answers'
const RECENT_LIMIT = 50

export function pickRandomAnswer(
  pool: readonly string[],
  recent: readonly string[],
  random: () => number = Math.random,
): string {
  const recentSet = new Set(recent)
  const fresh = pool.filter((w) => !recentSet.has(w))
  const choices = fresh.length > 0 ? fresh : pool
  return choices[Math.floor(random() * choices.length)]
}

// localStorage can be missing or throw (private windows, blocked site data);
// the game must still work, it just forgets what it showed you.
export function loadRecent(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((w) => typeof w === 'string') : []
  } catch {
    return []
  }
}

export function rememberAnswer(word: string): void {
  try {
    const next = [word, ...loadRecent().filter((w) => w !== word)].slice(0, RECENT_LIMIT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable — fine, see loadRecent
  }
}
