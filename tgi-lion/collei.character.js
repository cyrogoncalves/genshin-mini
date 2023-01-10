import {DENDRO} from "./model";

/** @type Summon */
const cuileinAnbar = {
  at: "end", duration: 2, name: "cuileinAnbar",
  effect(game) {
    game.deal(2, "D")
    this.duration--
  }
}

/** @type TGICharacter */
export const Collei = {
  name: "Collei", nation: "Sumeru", element: DENDRO, skills: [{
    name: "normal", type: "normal", costs: [{[DENDRO]:1, "any":2}],
    effect: (game) => {
      game.oppo.char.dmg.push(2)
    }
  }, {
    name: "skill", type: "skill", costs: [{[DENDRO]:3}],
    effect: (game, oppo) => {
      oppo.dmg.push(3)
      oppo.elements.push(DENDRO)
    }
  }, {
    name: "burst", type: "burst", costs: [{[DENDRO]:3, "energy":2}],
    effect: (game) => {
      game.player.summons.push({...cuileinAnbar})
    }
  }]
}