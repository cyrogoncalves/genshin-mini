import {Summon, TGICharacter} from "./model";

const cuileinAnbar: Summon = {
  at: "end", duration: 2, name: "cuileinAnbar",
  effect(game) {
    game.deal(2, "D")
    this.duration--
  }
}

export const Collei: TGICharacter = {
  name: "Collei", nation: "Sumeru", element: "D", skills: [{
    name: "normal", type: "normal", costs: [{"D":1, "any":2}],
    effect: (game) => {
      game.currentOpposingChar.dmg = 2
    }
  }, {
    name: "skill", type: "skill", costs: [{"D":3}],
    effect: (game, oppo) => {
      oppo.dmg = 3
      oppo.elements.push("D")
    }
  }, {
    name: "burst", type: "burst", costs: [{"D":3, "energy":2}],
    effect: (game) => {
      game.currentPlayer.summons.push({...cuileinAnbar})
    }
  }]
}