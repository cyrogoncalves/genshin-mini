
export const PYRO = 0
export const HYDRO = 1
export const ANEMO = 2
export const ELECTRO = 3
export const DENDRO = 4
export const CRYO = 5
export const GEO = 6
export const OMNI = 7

export const elements = [PYRO, HYDRO, ANEMO, ELECTRO, DENDRO, CRYO, GEO]
export const diceCosts = [OMNI, ...elements, "same", "any"]

/**
 * @typedef {{[c in number|"any"|"same"]?:number}} Cost
 * @typedef {{name:string, costs:Cost[], effect:any}} Card
 * @typedef {{name:string, costs:Cost[], type:"normal"|"skill"|"burst", effect:any}} Skill
 * @typedef {"bow"|"spear"|"sword"|"claymore"|"catalysts"} WeaponType
 * @typedef {{name:string, nation:string, element:number, weaponType:WeaponType, skills:Skill[]}} TGICharacter
 * @typedef {{name:string, userId:string, characters:TGICharacter[], cards:Card[]}} Deck
 * @typedef {{name:string, at:"end"|"start"|"hit", duration:number, effect:any}} Summon
 * @typedef {{}} Support
 */

/**
 * @typedef {{
 *   userId: string,
 *   deck: Card[],
 *   characters: any[],
 *   hand: Card[],
 *   curCharIdx: number,
 *   dice: number[],
 *   supports: Support[],
 *   summons: Summon[],
 *
 *   draw: (number) => void
 * }} Player
 */
/**
 * @typedef {{
 *   players: Player[],
 *   curPlayerIdx: number,
 *   player: Player,
 *   oppo: Player,
 *   char: TGICharacter,
 *   currentOpposingChar: TGICharacter,
 *   canStart(): boolean
 * }} Game
 */