/** @type TGICharacter */
export const Chongyun = {
  name: "Chongyun", nation: "Liyue", element: "氷", weaponType: "claymore", maxEnergy: 3, skills: [{
    name: "Tempered Sword", type: "normal", cost: { "氷": 1, "any": 2 }, effect: (game) => game.deal(2)
  }, {
    name: "Chonghua's Layered Frost", type: "skill", cost: { "氷": 3 }, effect: game => {
      game.deal(3, "氷")
      // Sword, Claymore, and Polearm-wielding characters' Physical DMG is converted to Cryo DMG.
      game.player.auras.push({
        name: "Chonghua's Frost Field",
        use: 2,
        atk: g => g.action.element = "氷",
        when: g => ["sword", "claymore", "polearm"].includes(g.action.weaponType) && !g.action.element
      })
    }
  }, {
    name: "Cloud-Parting Star", type: "burst", cost: { "氷": 3, "energy": 3 }, effect: game => game.deal(7, "氷")
  }]
}

// Steady Breathing	Chonghua's Layered Frost	4
// Combat Action: When your active character is Chongyun, equip this card.
// After Chongyun equips this card, immediately use Chonghua's Layered Frost once.
// When your Chongyun, who has this card equipped, creates a Chonghua Frost Field, it will have the following effects: Starting Duration (Rounds) +1, will cause your Sword, Claymore, and Polearm-wielding characters' Normal Attacks to deal +1 DMG.

// TODO 'unless' feels bad, check
//  energy cost for burst,
//  add auras to players and chars,
//  create test for this cryo infusion,
//  create, apply and test talent card
