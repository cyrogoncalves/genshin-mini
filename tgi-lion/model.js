/**
 * @typedef {"炎"|"水"|"風"|"電"|"草"|"岩"|"氷"} Element
 * @typedef {Element|"any"|"same"|"omni"} CostType
 * @typedef {{[c in CostType]?:number}} Cost
 * @typedef {{[name]:string, [cost]:Cost, effect:(Game)=>void}} Card
 * @typedef {{name:string, cost:Cost, effect:(Game)=>void, type:"normal"|"skill"|"burst"}} Skill
 * @typedef {"bow"|"spear"|"sword"|"claymore"|"catalysts"} WeaponType
 * @typedef {{name:string, nation:string, element:Element, weaponType:WeaponType, skills:Skill[], [maxHp]:number}} TGICharacter
 * @typedef {{name:string, userId:string, characters:TGICharacter[], cards:Card[]}} Deck
 * @typedef {"end"|"start"|"hit"|"atk"} TriggerAt
 * @typedef {{[t in TriggerAt]?:(Game) => void}} Trigger
 * @typedef {{name:string, duration:number, [t in TriggerAt]:(Game) => void}} Summon
 * @typedef {{}} Support
 */

/**
 * @typedef {{
 *   userId: string,
 *   deck: Card[],
 *   characters: any[],
 *   hand: Card[],
 *   curCharIdx: number,
 *   dice: CostType[],
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
 *   canStart(): boolean,
 *   logs: string[],
 *   action: {},
 *   charge: (number) => void
 * }} Game
 */
