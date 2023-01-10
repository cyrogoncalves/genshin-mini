
export const PYRO = 0
export const HYDRO = 1
export const ANEMO = 2
export const ELECTRO = 3
export const DENDRO = 4
export const CRYO = 5
export const GEO = 6
export const OMNI = 7

/**
 * @typedef {{[c in number|"any"|"same"|"energy"]?:number}} Cost
 * @typedef {{name:string, costs:Cost[], effect:any}} Card
 * @typedef {{name:string, costs:Cost[], type:"normal"|"skill"|"burst", effect:any}} Skill
 * @typedef {{name:string, nation:string, element:number, skills:Skill[]}} TGICharacter
 * @typedef {{name:string, userId:string, characters:TGICharacter[], cards:Card[]}} Deck
 * @typedef {{name:string, at:"end"|"start"|"hit", duration:number, effect:any}} Summon
 * @typedef {{}} Support
 */