
export type TGIElement = "A"|"P"|"C"|"E"|"H"|"D"|"G"
export type DieFace = TGIElement | "O"
export type Cost = {[c in TGIElement|"any"|"same"|"energy"]?: number}

export type Card = {
  name: string,
  costs: Cost[],
  effect: any
}

export type Skill = {name: string, costs: Cost[], type: "normal"|"skill"|"burst", effect: any}
export type TGICharacter = {
  name: string, nation: string, element: TGIElement,
  skills: Skill[]
}

export type Deck = {
  userId: string,
  name: string,
  characters: TGICharacter[],
  cards: Card[]
}

export type Summon = {
  at: "end"|"start"|"hit",
  duration: number,
  name: string,
  effect
}

export type Player = {
  userId: string,
  deck: Card[]
  characters: any[],
  hand: Card[],
  curCharIdx: number,
  dice: DieFace[],
  supports: Support[],
  summons: Summon[]
}

export type Game = {
  players: Player[],
  curPlayerIdx: number
}
