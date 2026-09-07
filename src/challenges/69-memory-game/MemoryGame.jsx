/**
 * LEVEL 69 — turn two over and hope
 *
 * Topics: a timer driven by state · locking input · derived reveal
 * Read:   https://react.dev/reference/react/useEffect#connecting-to-an-external-system
 * Read:   https://react.dev/learn/choosing-the-state-structure
 *
 * Props: { cards: string[] }  — already in play order, no shuffling needed
 *
 * Render:
 *   one button per card, labelled "Card 1", "Card 2", … showing the card's
 *   value when face up and nothing when face down. The text "You win" once
 *   every card is matched.
 *
 * Rules:
 *  1. Every card starts face down.
 *  2. Clicking turns a card face up. Two may be up at once.
 *  3. A matching pair stays face up forever.
 *  4. A non-matching pair turns back over 1000ms later, not before.
 *  5. While a non-matching pair is showing, further clicks are ignored.
 *  6. A card already face up cannot be clicked again — so the same card twice
 *     is not a pair.
 *  7. Unmounting mid-guess leaves no timer behind.
 *
 * Which cards are face up is state; which are matched is state. Whether the
 * timer is running is not — it follows from having two flipped cards, which is
 * exactly what the effect's dependency should be.
 */
export default function MemoryGame({ cards }) {
  return null
}
