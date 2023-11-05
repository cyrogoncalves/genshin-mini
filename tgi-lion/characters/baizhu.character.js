// on use or refresh todo
const SeamlessShield = {
  shield: 1,
  destroy: g => {
    // todo g.shield
  }
}

/** @type TGICharacter */
export const Baizhu = {
  name:"Baizhu", nation:"Liyue", element:"草", weaponType:"catalysts", skills: [{
    name:"normal", type:"normal", cost:{"草":1, "any":2},
    effect: game => game.deal(2)
  }, {
    name:"skill", type:"skill", cost:{"草":3},
    effect: game => {
      game.deal(1, "草")
      game.player.summons["Gossamer Sprite"] = {
        use: 1,
        end: g => {
          g.deal(1, "草");
          g.player.char.hp += 1
        }
      }
    }
  }, {
    name:"Holistic Revification", type:"burst", cost:{"草":4, energy:2},
    effect: game => {
      game.deal(1, "草")
      game.player.aura["Pulsing Clarity"] = {
        use:2, hit: g => {
          g.player.char.hp += 2
          g.player.char.energy += 1
        }
      }
      game.player.aura["Seamless Shield"] = { ...SeamlessShield }
    }
  }]
}