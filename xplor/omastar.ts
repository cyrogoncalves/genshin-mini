// https://www.redblobgames.com/pathfinding/a-star/introduction.html
type Pos = {x:number, y:number};
type Graph = {
  cost: (current: Pos, next: Pos) => number,
  neighbors: (position: Pos) => Pos[]
}

export const omastar = (start: Pos, goal: Pos, graph: Graph) => {
  const frontier = [start];
  const cameFrom = {};
  const costSoFar = { [`${start.x}_${start.y}`]: 0 };

  let count = 0
  while (frontier.length > 0 || count++ < 1e7) {
    const current = frontier.shift();
    if (current === goal) break;
    for (let next of graph.neighbors(current)) {
      const newCost = costSoFar[`${current.x}_${current.y}`] + graph.cost(current, next);
      const nextIdx = `${current.x}_${current.y}`;
      if (!costSoFar[nextIdx] || newCost < costSoFar[nextIdx]) {
        costSoFar[nextIdx] = newCost;
        const priority = newCost + Math.abs(goal.x - next.x) + Math.abs(goal.y - next.y);
        const idx = frontier.findIndex(f => costSoFar[`${f.x}_${f.y}`] > priority);
        idx ? frontier.splice(idx - 1, 0, next) : frontier.push(next);
        cameFrom[nextIdx] = current;
      }
    }
  }

  const path = [];
  for (let n = goal; n !== start; n = cameFrom[`${n.x}_${n.y}`])
    path.unshift(n);
  return path;
}