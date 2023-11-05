// 🏹
const desc = "Collei Sumeru 草 bow n(2s1草:hit2) e(3草:hit3草) b(summon Cuilein-Anbar dur2 at:end:hit2草)"

/** @type Summon */
const cuileinAnbar = {
  at:"end", duration:2, name:"Cuilein-Anbar",
  effect: game => game.deal(2, "草")
}

/** @type TGICharacter */
export const Collei = {
  name:"Collei", nation:"Sumeru", element:"草", weaponType:"bow", skills: [{
    name:"normal", type:"normal", cost:{"草":1, "any":2},
    effect: game => game.deal(2)
  }, {
    name:"skill", type:"skill", cost:{"草":3},
    effect: game => game.deal(3, "草")
  }, {
    name:"burst", type:"burst", cost:{"草":3,energy:2},
    effect: game => game.player.summons.push({...cuileinAnbar})
  }]
}
