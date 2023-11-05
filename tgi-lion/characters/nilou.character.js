/** @type TGICharacter */
export const Nilou = {
  name:"Nilou", nation:"Sumeru", element:"水", weaponType:"sword", skills: [{
    name:"Dance of Samser", type:"normal", cost:{"水":1, "any":2},
    effect: game => game.deal(2)
  }, {
    name:"Dance of Haftkarsvar", type:"skill", cost:{"水":3},
    effect: game => {
      game.deal(3, "水");
      const hydroChars = game.player.characters.filter(c=>c.element === "水").length
      const dendroChars = game.player.characters.filter(c=>c.element === "草").length
      if (!dendroChars || hydroChars + dendroChars < 3) return
      game.player.auras["Golde Chalice's Bounty"] = {
        unless: g => !g.oppo.auras["水"] || !g.oppo.auras["草"],
        hit: g => {
          delete g.oppo.auras["水"]
          delete g.oppo.auras["草"]
          g.oppo.summons["Bountiful Core"] = {
            use: Math.min((g.oppo.summons["Bountiful Core"]?.use ?? 0) + 1, 3),
            pass: g => {
              if (this.use > 1)
                g.deal(2, "草")
              else
                this.use++ //fixme
            },
            end: g => g.deal(2, "草")
          }
        }
      }
    }
  }, {
    name:"Dance of Abzendegi", type:"burst", cost:{"水":3, energy:2},
    effect: game => {
      game.deal(2, "水")
      game.oppo.char.auras["Lingering Aeon"] = {
        use: 1, at:"end", do: g => g.deal(3, "水")
      }
    }
  }]
}
