// https://www.redblobgames.com/pathfinding/a-star/introduction.html
type Pos = {x:number, y:number};
type Graph = {
  cost: (current: Pos, next: Pos) => number,
  neighbors: (position: Pos) => Pos[]
}

export const createGraph = (maxX:number, maxY:number):Graph => ({
  cost: (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
  neighbors: p => [{x: p.x, y: p.y + 1}, {x: p.x + 1, y: p.y}, {x: p.x, y: p.y - 1}, {x: p.x - 1, y: p.y}]
          .filter(({x, y}) => x >= 0 && x <= maxX && y >= 0 && y <= maxY)
})

const exploreFrontier = (start: Pos, goal: Pos, graph) => {
  const frontier = [start];
  const cameFrom = {};
  const costSoFar = {[`${start.x}_${start.y}`]: 0};

  let count = 0
  while (frontier.length > 0 && count++ < 1e7) {
    const current = frontier.shift();
    for (let next of graph.neighbors(current)) {
      const newCost = costSoFar[`${current.x}_${current.y}`] + graph.cost(current, next);
      const nextIdx = `${next.x}_${next.y}`;
      if (costSoFar[nextIdx] === undefined || newCost < costSoFar[nextIdx]) {
        // console.log({next, newCost});
        costSoFar[nextIdx] = newCost;
        cameFrom[nextIdx] = current;

        console.log([0, 1, 2, 3, 4, 5, 6, 7, 8].map(x =>
            [0, 1, 2, 3, 4, 5].map(y =>
                /*`${x}_${y}:`+*/ String(costSoFar[`${x}_${y}`] ?? "-").padEnd(3)).join(" ")
        ).join("\n"))

        if (next.x === goal.x && next.y === goal.y) return cameFrom;

        const priority = newCost + Math.abs(goal.x - next.x) + Math.abs(goal.y - next.y);
        const idx = frontier.findIndex(f => costSoFar[`${f.x}_${f.y}`] > priority);
        idx ? frontier.splice(idx - 1, 0, next) : frontier.push(next);
      }
    }
  }
}

export const omastar = (start: Pos, goal: Pos, graph: Graph = createGraph(8, 5)) => {
  const cameFrom = exploreFrontier(start, goal, graph);
  const path = [];
  for (let n = goal; n !== start; n = cameFrom[`${n.x}_${n.y}`]) {
    // console.log(n)
    path.unshift(n);
  }
  return path;
}