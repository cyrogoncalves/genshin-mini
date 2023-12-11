/**
 * @param el ELement
 * @returns {function(): Element[]}
 */
export const scamRolls = el => () => Array.from({length:8}, () => el)