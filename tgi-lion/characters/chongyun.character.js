import {CRYO} from "../model";

/** @type TGICharacter */
export const Chongyun = {
    name:"Chongyun", nation:"Liyue", element:CRYO, weaponType:"claymore", skills: [{
        name:"Tempered Sword", type:"normal", costs:[{[CRYO]:1, "any":2}],
        effect: (game) => game.deal(2)
    }, {
        name:"Searing Onslaught", type:"skill", costs:[{[CRYO]:3}],
        effect: (game) => {
            game.deal(3, CRYO)
            // Your Sword, Claymore, and Polearm-wielding characters' Physical DMG is converted to Cryo DMG. TODO
            game.player.infusions.push({[CRYO]:2})
        }
    }, {
        name:"Dawn", type:"burst", costs:[{[CRYO]:4, "energy":3}],
        effect: (game) => game.deal(7, CRYO)
    }]
}