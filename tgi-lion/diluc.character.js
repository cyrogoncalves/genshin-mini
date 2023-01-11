import {PYRO} from "./model";

/** @type TGICharacter */
export const Diluc = {
    name:"Diluc", nation:"Mondstat", element:PYRO, weaponType:"claymore", skills: [{
        name:"normal", type:"normal", costs:[{[PYRO]:1, "any":2}],
        effect: (game) => {
            game.oppo.char.dmg.push(2)
        }
    }, {
        name:"skill", type:"skill", costs:[{[PYRO]:3}],
        effect: (game, oppo) => {
            oppo.dmg.push(3)
            // if (game.actions.count(it=>it.name==="normal" && it.player===game.player)===2)
            //    oppo.bonusDmg.push(2)
            oppo.elements.push(PYRO)
        }
    }, {
        name:"burst", type:"burst", costs:[{[PYRO]:4, "energy":3}],
        effect: (game) => {
            game.oppo.dmg.push(8)
            game.oppo.elements.push(PYRO)
            game.player.infusions.push({[PYRO]:2})
        }
    }]
}