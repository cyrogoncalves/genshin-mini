/**
 * @param {Deck} decks
 * @returns Game
 */
export const startGame = (...decks) => ({
  players: decks.map(deck => ({
    deck:[...deck.cards],
    characters:deck.characters.map(c => ({...c, hp:10, dmg:[], dmgBonus:0})),
    userId:deck.userId,
    hand:[], curCharIdx:-1, dice:[], supports:[], summons:[],
    effects:[],
    get char() {return this.characters[this.curCharIdx]},
    draw(n) {this.hand.push(...this.deck.splice(0, n))}
  })),
  curPlayerIdx: 0,
  logs:[],

  // shortcuts
  get player() {return this.players[this.curPlayerIdx]},
  get oppo() {return this.players[(this.curPlayerIdx + 1) % this.players.length]},
  canStart() {return !this.players.some(p => p.curCharIdx < 0)},

  // helpers
  deal(dmg, element) {
    this.oppo.char.dmg.push(dmg)
    if (element) this.oppo.char.elements.push(element)
    if (this.player.char.energy < this.player.char.maxEnergy)
      this.player.char.energy++
    return this
  }
})

/**
 * @param {Game} game
 * @param {string} userId
 * @param {number} idx
 */
export function chooseCharacter(game, userId, idx) {
  game.players.find(p=>p.userId===userId).curCharIdx = idx
  if (game.canStart()) {
    game.players.forEach(p=>p.draw(5))
    startTurn(game)
  }
}

const startTurn = (game) => {
  // todo process at:start
  game.players.forEach(p => {
    p.dice = Array.from({length:8}, () => Math.floor(Math.random() * 8));
    p.rerolls = 0
  })
}

/**
 * @param {Game} game
 * @param {string} userId
 * @param {number[]} costDiceIdx
 * @param {number} skillIdx
 */
export const attack = (game, userId, costDiceIdx, skillIdx) => {
  const skill = game.player.char.skills[skillIdx]
  // game.action = {type:"atk", skill}
  // game.aurasFor("atk", game.action) // tick
  // todo on:atk
  payDice(game, costDiceIdx, skill.cost)
  skill.effect(game)
  // todo resolve reactions
  const dmg = game.oppo.char.dmg.pop() + game.player.char.dmgBonus
  // todo shields
  game.logs.push(`${game.player.char.name} dealt ${dmg}`)
  game.oppo.char.hp -= dmg
  game.player.char.energy = Math.min((game.player.char.energy??0) + 1, game.player.char.skills.find(s=>s.type==="burst").cost.energy)
  // todo resolve knockouts & character select
  passTurn(game)
}

/**
 * @param {Game} game
 * @param {string} userId
 * @param {number} dieIdx
 * @param {number} cardIdx
 */
export function attune(game, userId, dieIdx, cardIdx) {
  game.player.hand.splice(cardIdx, 1)
  game.player.dice[dieIdx] = game.player.char.element
}

/**
 * @param {Cost} cost
 * @param {number[]} dice
 */
export const validateCost = (cost, dice) => {
  const elements = ["炎","水","風","電","草","岩","氷"]
  Object.entries(cost).forEach(([k,v]) => {
    if (k==="any") {
      if (v > dice.length) return false
      dice.splice(0, v)
    } else {
      const element = k !== "same" ? elements.indexOf(k)
        : elements.findIndex(el => dice.filter(d=>d===elements.indexOf(el)||d===7).length >= v)
      for (let i = 0; i < v; i++) {
        const idx = dice.findIndex(d=>d===element||d===7);
        if (idx === -1) return false
        dice.splice(idx, 1)
      }
    }
  })
  return dice.length === 0
}

/**
 * @param {Game} game
 * @param {number[]} costDiceIdx
 * @param {Cost} cost
 */
const payDice = (game, costDiceIdx, cost) => {
  const paidDice = costDiceIdx.map(i => game.player.dice[i])
  if (!validateCost(cost, paidDice)) return console.error("Invalid cost");

  game.player.dice = game.player.dice.filter((_, i)=>!costDiceIdx.includes(i))
}

/** @param {Game} game */
const passTurn = (game) =>
  game.curPlayerIdx = (game.curPlayerIdx+1) % game.players.length

/**
 * @param {Game} game
 * @param {number[]} costDiceIdx
 */
export const changeCharacter = (game, costDiceIdx) => {
  payDice(game, costDiceIdx, {"any":1})
  passTurn(game)
}

/**
 * @param {Game} game
 * @param {number} cardIdx
 */
export const playCard = (game, cardIdx) => {
  const [card] = game.player.hand.splice(cardIdx, 1)
  card.effect(game)
}

//reroll
//useSkill
//surrender