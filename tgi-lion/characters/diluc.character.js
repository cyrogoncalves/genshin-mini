/** @type TGICharacter */
export const Diluc = {
    name:"Diluc", nation:"Mondstat", element:"炎", weaponType:"claymore", skills: [{
        name:"Tempered Sword", type:"normal", cost:{"炎":1,"any":2},
        effect: game => game.deal(2)
    }, {
        name:"Searing Onslaught", type:"skill", cost:{"炎":3},
        effect: (game) => {
            const dmg = game.actions.count(it=>it.name==="Searing Onslaught" && it.player===game.player)===2 ? 5 : 2
            game.deal(dmg, "炎")
        }
    }, {
        name:"Dawn", type:"burst", cost:{"炎":4, "energy":3},
        effect: (game) => {
            game.deal(8, "炎")
            game.player.char.infusions.push({"炎":2})
        }
    }]
}