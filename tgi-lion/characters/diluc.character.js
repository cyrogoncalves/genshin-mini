/** @type TGICharacter */
export const Diluc = {
    name:"Diluc", nation:"Mondstat", element:"炎", weaponType:"claymore", maxEnergy: 3, skills: [{
        name:"Tempered Sword", type:"normal", cost:{"炎":1,"any":2},
        effect: game => game.deal(2)
    }, {
        name:"Searing Onslaught", type:"skill", cost:{"炎":3},
        effect: (game) => {
            const dmg = game.actions.filter(it=>it.skill.name==="Searing Onslaught" && it.player===game.player).length===1 ? 5 : 3
            game.deal(dmg, "炎")
        }
    }, {
        name:"Dawn", type:"burst", cost:{"炎":4, "energy":3},
        effect: (game) => {
            game.deal(8, "炎")
            game.player.char.auras.push({
                name: "Pyro infusion",
                use: 2,
                atk: g => g.action.element = "炎",
                when: g => !g.action.element
            })
        }
    }]
}
// Combat Action: When your active character is Diluc, equip this card.
// After Diluc equips this card, immediately use Searing Onslaught once.
// When your Diluc, who has this card equipped, uses Searing Onslaught for the second time in one Round, spend 1 less Pyro Die.