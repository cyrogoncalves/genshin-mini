/** @type TGICharacter */
export const Dori = {
  name:"Dori", nation:"Sumeru", element:"電", weaponType:"claymore", skills: [{
    name:"normal", type:"normal", cost:{"電":1, "any":2},
    effect: game => game.deal(2)
  }, {
    name:"skill", type:"skill", cost:{"電":3},
    effect: game => {
      game.deal(2, "電")
      game.player.summons["After-sales Service Rounds"] = {
        use: 1,
        end: g => g.deal(1, "電")
      }
    }
  }, {
    name:"Alcazarzaray's Exactitude", type:"burst", cost:{"電":3, energy:2},
    effect: game => {
      game.deal(1, "電")
      game.player.summons["Jinni"] = {
        use:2, end: g => {
          g.player.char.hp += 2
          g.player.char.energy += 1
        }
      }
    }
  }]
}

// Card talent
const DoriTalent = {
  skill: {
    name:"Alcazarzaray's Exactitude", type:"burst", cost:{"電":3, energy:2},
    effect: game => {
      game.deal(1, "電")
      game.player.summons["Jinni"] = {
        use:2, end: g => {
          g.player.char.hp += g.player.char.hp < 7 ? 3 : 2
          g.player.char.energy += 2
        }
      }
    }
  }
}