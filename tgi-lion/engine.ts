import {Game, Player} from "./model";

export const attack = (game, skill) => {
  const oppo = game.currentOpposingChar
  skill.effect(game)
  // todo resolve reactions
  const dmg = oppo.dmg.pop() + game.currentChar.dmgBonus
  // todo shields
  game.logs.push(`${game.currentChar.name} dealt ${dmg}`)
  oppo.hp -= dmg
  // todo resolve faints & character select
}

export const startGame = (...decks): Game => {
  const players = decks.map<Player>(deck => ({
    deck: {...deck.cards}, characters: deck.characters.map(c=>({...c})),
    userId: deck.userId,
    hand: [], curCharIdx: 0, dice: [], supports: [], summons: []
  }))
  return { players, curPlayerIdx:0 }
}

export function chooseCharacter(game: Game, userId: string, idx: number) {
  game.players.find(p=>p.userId===userId).curCharIdx = idx
}
//tuneDie
//playCard
//changeChar
//useSkill
//surrender
//passTurn *