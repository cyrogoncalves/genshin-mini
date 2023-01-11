import {DENDRO, PYRO} from "./model";

/** @type Summon */
const cuileinAnbar = {
  at:"end", duration:2, name:"Cuilein-Anbar",
  effect(game) {
    game.deal(2, DENDRO)
    this.duration--
  }
}

/** @type TGICharacter */
export const Collei = {
  name:"Collei", nation:"Sumeru", element:DENDRO, weaponType:"bow", skills: [{
    name:"normal", type:"normal", costs:[{[DENDRO]:1, "any":2}],
    effect: (game) => {
      game.oppo.char.dmg.push(2)
    }
  }, {
    name:"skill", type:"skill", costs:[{[DENDRO]:3}],
    effect: (game, oppo) => {
      oppo.dmg.push(3)
      oppo.elements.push(DENDRO)
    }
  }, {
    name:"burst", type:"burst", costs:[{[DENDRO]:3, "energy":2}],
    effect: (game) => {
      game.player.summons.push({...cuileinAnbar})
    }
  }]
}