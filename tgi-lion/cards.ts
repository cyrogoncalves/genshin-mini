import {Card, Cost} from "./model";

export const strategize: Card = {
  name: "Strategize",
  costs: [{"any":1}],
  effect(game, paidCosts) {
    const cur = game.currentPlayer;
    cur.hand.push(cur.curDeck.pop())
    cur.hand.push(cur.curDeck.pop())
    paidCosts.forEach(p => cur.dice.splice(p, 1))
  }
}