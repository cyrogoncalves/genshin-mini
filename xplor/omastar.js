// https://www.redblobgames.com/pathfinding/a-star/introduction.html

/** @typedef {{q:number, r:number}} Hex */
/** @typedef {{
  cost: (current: Hex, next: Hex) => number,
  neighbors: (position: Hex) => Hex[]
}} Graph */

const axialDistance = (a, b) =>
    (Math.abs(a.q - b.q)
    + Math.abs(a.q + a.r - b.q - b.r)
    + Math.abs(a.r - b.r)) / 2


/** @returns {Graph} */
const createGraph = () => ({
  cost: (a, b) => Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r)),
  neighbors: p => [
    {q:p.q-1, r:p.r+1},
    {q:p.q-1, r:p.r},
    {q:p.q, r:p.r-1},
    {q:p.q+1, r:p.r-1},
    {q:p.q+1, r:p.r},
    {q:p.q, r:p.r+1},
  ]
})

/**
 * @param {Hex} start
 * @param {Hex} goal
 * @param {Graph} graph
 * @returns {{[p:string]: Hex}}
 */
const exploreFrontier = (start, goal, graph) => {
  const frontier = [start];
  const cameFrom = {};
  const costSoFar = {[`${start.q}_${start.r}`]: 0};

  for (let count = 0; frontier.length > 0 && count < 1e7; count++) {
    /** @type Hex */ const current = frontier.shift();
    for (let next of graph.neighbors(current)
        .sort((a, b) => axialDistance(goal, b) - axialDistance(goal, a))) {
      const newCost = costSoFar[`${current.q}_${current.r}`] + 1 // graph.cost(current, next);
      const nextIdx = `${next.q}_${next.r}`;
      if (newCost >= costSoFar[nextIdx]) continue;
      costSoFar[nextIdx] = newCost;
      cameFrom[nextIdx] = current;
      // console.log([0, 1, 2, 3, 4, 5, 6, 7, 8].map(x => [0, 1, 2, 3, 4, 5].map(y =>
      //     /*`${x}_${y}:`+*/ String(costSoFar[`${x}_${y}`] ?? "-").padEnd(3)).join(" ")
      // ).join("\n"))
      if (next.q === goal.q && next.r === goal.r) return cameFrom;
      const priority = newCost + axialDistance(goal, next) // Math.abs(goal.q - next.q) + Math.abs(goal.r - next.r);
      const idx = frontier.findIndex(f => costSoFar[`${f.q}_${f.r}`] > priority);
      idx ? frontier.splice(idx - 1, 0, next) : frontier.push(next);
    }
  }
}

/**
 * @param {Hex} start
 * @param {Hex} goal
 * @param {Graph} graph
 * @returns {Hex[]}
 */
export const omastar = (start, goal, graph = createGraph()) => {
  const cameFrom = exploreFrontier(start, goal, graph);
  const path = [];
  for (let n = goal; n !== start; n = cameFrom[`${n.q}_${n.r}`])
    path.unshift(n);
  return path;
}