/** @type TGICharacter */
export const Kazuha = {
    name:"Kazuha", nation:"Inazuma", element:"風", weaponType:"sword", skills: [{
        name:"Garyuu Bladework", type:"normal", cost:{"風":1, "any":2},
        effect: game => game.deal(2)
    }, {
        name:"Chihayaburu", type:"skill", cost:{"風":3},
        effect: game => {
            game.deal(3, "風")
            // If this skill triggers Swirl, Midare Ranzan is converted to the Swirled Element.
            // TODO check if triggered swirl
            game.player.char.auras["Midare Ranzan"] = {
                use: 1,
                on: "atk",
                unless: g => !g.isPlungingAttack(),
                do: g => {
                    g.atk++
                    g.element = "風" // TODO swirled || "風"
                }
            }
            game.player.nextChar()
        }
    }, {
        name:"Kazuha Slash", type:"burst", cost:{"風":3, "energy":2},
        effect: game => {
            game.deal(3, "風")
            game.player.summons["Autumn Whirlwind"] = {
                use: 3,
                at: "end",
                element: "風",
                do: g => {
                    g.deal(1, this.element)
                    // TODO check if triggered swirl for the first time: this.element = swirled
                }
            }
        }
    }]
}