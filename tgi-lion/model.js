/**
 * @typedef {"炎"|"水"|"風"|"電"|"草"|"岩"|"氷"} Element
 * @typedef {{[c in Element|"any"|"same"]?:number}} Cost
 * @typedef {{name:string, cost:Cost, effect:(Game)=>void}} Card
 * @typedef {{name:string, cost:Cost, effect:(Game)=>void, type:"normal"|"skill"|"burst"}} Skill
 * @typedef {"bow"|"spear"|"sword"|"claymore"|"catalysts"} WeaponType
 * @typedef {{name:string, nation:string, element:Element, weaponType:WeaponType, skills:Skill[]}} TGICharacter
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