/** @type TGICharacter */
export const Chongyun = {
    name:"Chongyun", nation:"Liyue", element:"氷", weaponType:"claymore", skills: [{
        name:"Tempered Sword", type:"normal", cost:{"氷":1, "any":2},
        effect: (game) => game.deal(2)
    }, {
        name:"Searing Onslaught", type:"skill", cost:{"氷":3},
        effect: game => {
            game.deal(3, "氷")
            // Your Sword, Claymore, and Polearm-wielding characters' Physical DMG is converted to "氷" DMG. TODO
            game.player.infusions.push({"氷":2})
        }
    }, {
        name:"Dawn", type:"burst", cost:{"氷":4, "energy":3},
        effect: game => game.deal(7, "氷")
    }]
}