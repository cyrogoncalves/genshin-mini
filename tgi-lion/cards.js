/** @type Card */
export const Strategize = {
  name: "Strategize",
  costs: [{"any":1}],
  effect(game, paidCosts) {
    const cur = game.currentPlayer;
    cur.hand.push(cur.curDeck.pop())
    cur.hand.push(cur.curDeck.pop())
    paidCosts.forEach(p => cur.dice.splice(p, 1))
  }
}

/** @type Card */
export const ChangingShifts = {
  name:"Changing Shifts",
  costs: [], // || "same":0
  effect(game) {
    game.player.auras.push({
      switch: {
        costModification:{any:-1},
        count:1
      }
    });
  }
}