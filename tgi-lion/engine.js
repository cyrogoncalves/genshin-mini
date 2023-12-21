/**
 * @param {Deck[]} decks
 * @param roller
 * @returns Game
 */
export const startGame = (decks, roller = rollDice) => ({
  players: decks.map(deck => ({
    deck:[...deck.cards],
    characters:deck.characters.map(c => ({ data:c, hp:c.hp??10, energy:0, auras:[] })),
    userId:deck.userId,
    hand:[], curCharIdx:-1, dice:[], supports:[], summons:[], auras:[],
    get char() {return this.characters[this.curCharIdx]},
    draw(n) {this.hand.push(...this.deck.splice(0, n))}
  })),
  curPlayerIdx: 0,
  logs:[],
  actions: [],
  action: null,

  roller,

  // shortcuts
  get player() {return this.players[this.curPlayerIdx]},
  get oppo() {return this.players[(this.curPlayerIdx + 1) % this.players.length]},
  canStart() {return !this.players.some(p => p.curCharIdx < 0)},

  // helpers
  deal(dmg, element) {
    this.action = { dmg, element, energyGain: 1 }
  },
  charge(energy=1) {
    this.player.char.energy = Math.min(this.player.char.energy + energy, this.player.char.data.maxEnergy)
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

const elements = ["炎","水","風","電","草","岩","氷","*"];

const rollDice = () => Array.from({length:8},
  () => elements[Math.floor(Math.random() * 8)])

const startTurn = (game) => {
  // todo process at:start
  game.players.forEach(p => {
    p.dice = game.roller()
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
  const skill = game.player.char.data.skills[skillIdx]
  payDice(game, costDiceIdx, skill.cost)
  skill.effect(game)
  if (game.action) game.actions.push({ player: game.player, skill })
  game.player.auras.filter(a => a.atk && (!a.when || a.when(game))).forEach(a => {
    a.atk(game)
    if (a.use) a.use--
  })
  // todo resolve reactions
  // todo shields
  game.logs.push(`${game.player.char.data.name} dealt ${game.action.dmg}`)
  game.oppo.char.hp -= game.action.dmg
  if (game.action.element) (game.oppo.char.elements??=[]).push(game.action.element)
  if (game.action.energyGain) game.charge(game.action.energyGain)
  if (skill.cost.energy) game.player.char.energy -= skill.cost.energy
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
  game.player.dice[dieIdx] = game.player.char.data.element
}

/**
 * @param {Cost} cost
 * @param {CostType[]} dice
 */
export const validateCost = (cost, dice) => {
  const elements = ["炎","水","風","電","草","岩","氷"]
  Object.entries(cost).forEach(([k,v]) => {
    if (k==="any") {
      if (v > dice.length) return false
      dice.splice(0, v)
    } else {
      const element = k !== "same" ? k
        : elements.find(el => dice.filter(d=>d===el||d==="omni").length >= v)
      for (let i = 0; i < v; i++) {
        const idx = dice.findIndex(d=>d===element||d==="omni");
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
 * @param {number} targetCharIdx
 */
export const changeCharacter = (game, costDiceIdx, targetCharIdx) => {
  payDice(game, costDiceIdx, {"any":1})
  game.player.curCharIdx = targetCharIdx // todo validate not same, validate exists
  passTurn(game)
}

/**
 * @param {Game} game
 * @param {number} cardIdx
 * @param {number[]} costDiceIdx
 */
export const playCard = (game, cardIdx, costDiceIdx = []) => {
  const [card] = game.player.hand.splice(cardIdx, 1)
  payDice(game, costDiceIdx, card.cost) // TODO can't pay
  card.effect(game)
}

//reroll
//useSkill
//surrender