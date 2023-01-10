/** @type Card */
export const strategize = {
  name: "Strategize",
  costs: [{"any":1}],
  effect(game, paidCosts) {
    const cur = game.currentPlayer;
    cur.hand.push(cur.curDeck.pop())
    cur.hand.push(cur.curDeck.pop())
    paidCosts.forEach(p => cur.dice.splice(p, 1))
  }
}