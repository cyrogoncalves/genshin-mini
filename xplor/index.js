// import * as PIXI from "pixi.js";
import { omastar } from "./omastar.js";

/** @typedef AvatarEntity = { hex: {q:number, r:number} sprite: PIXI.Sprite } */

const app = new PIXI.Application({ width: 800, height: 600,
  backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1 });
document.body.appendChild(app.view);

const SIZE = 56;
const SQRT3 = Math.sqrt(3);

const container = new PIXI.Container();
Object.assign(container, { x:SIZE/2, y:SIZE/2, width:800, height:600 });
app.stage.addChild(container);

const axialRound = (x, y) => {
  const xgrid = Math.round(x), ygrid = Math.round(y);
  x -= xgrid; y -= ygrid; // remainder
  const dx = Math.round(x + 0.5*y) * (x*x >= y*y);
  const dy = Math.round(y + 0.5*x) * (x*x < y*y);
  return {q:xgrid + dx, r:ygrid + dy};
}

const pixelToPointyHex = (x, y) => axialRound(
  ((SQRT3 / 3 * x - 1. / 3 * y) / SIZE),
  (2. / 3 * y / SIZE)
)
const pointyHexToPixel = hex => ({
  x: SIZE * (SQRT3 * hex.q + SQRT3 / 2 * hex.r),
  y: SIZE * 1.5 * hex.r
});

// [0,1,2,3,4,5,6,7].map(i=>[0,1,2,3,4,5,6,7].map(j=> {
//   const path = new PIXI.Graphics();
//   drawHex(path, {x:i, y:j});
//   app.stage.addChild(path);
// }))

const curHexPath = new PIXI.Graphics();
app.stage.addChild(curHexPath);
const drawHex = (path, { x, y }, color = 0xFFFFFF, size = SIZE) => {
  const points = [0,1,2,3,4,5].map(i => ({
    x: x + size * Math.cos(Math.PI / 180 * (60 * i - 30)),
    y: y + size * Math.sin(Math.PI / 180 * (60 * i - 30))
  }));
  path.clear().lineStyle(3, color, .2).moveTo(points[5].x, points[5].y);
  points.forEach(p => path.lineTo(p.x, p.y));
}

const selectedHexPath = new PIXI.Graphics();
app.stage.addChild(selectedHexPath);

container.interactive = true;
container.hitArea = new PIXI.Rectangle(0, 0, 800, 600);
const realPath = new PIXI.Graphics();
app.stage.addChild(realPath)
container.on('pointerdown', ev => {
  const goal = pixelToPointyHex(ev.data.global.x, ev.data.global.y);
  console.log({ x: ev.data.global.x, y: ev.data.global.y, q: goal.q, r: goal.r });
  if (team.some(t => goal.q === t.hex.q && goal.r === t.hex.r)) return;
  drawHex(selectedHexPath, pointyHexToPixel(goal), 0xFFFF66);
  const path = omastar(team[cur].hex, goal);
  // console.log({path});
  realPath.clear().lineStyle(2, 0xFFFFFF, 1).moveTo(team[cur].x, team[cur].y);
  path.map(p => pointyHexToPixel(p)).forEach(p => realPath.lineTo(p.x, p.y))
});

let cur = 0;
/** @type AvatarEntity[] */
const team = ["lanka.png", "tartartaglia.png", "morax.png", "walnut.png"].map((n, i) => ({
  hex: { q:i+2, r:3 },
  sprite: new PIXI.Sprite(PIXI.Texture.from(n)),
  get x() { return this.sprite.x + SIZE/2 },
  get y() { return this.sprite.y + SIZE/2 }
}))
team.forEach(t => {
  Object.assign(t.sprite, { rotation:0.06, interactive:true });
  t.sprite.on('pointerdown', () => {
    cur = team.findIndex(c => c.sprite === t.sprite);
    drawHex(curHexPath, team[cur]);
  });
  t.sprite.anchor.set(0.5);
  // t.sprite.scale = 0.5;
  container.addChild(t.sprite);
});
const updatePos = () => team.forEach(t => {
  const point = pointyHexToPixel(t.hex);
  [t.sprite.x, t.sprite.y] = [point.x - SIZE/2, point.y - SIZE/2];
})
updatePos()
drawHex(curHexPath, team[cur]);

let elapsed = 0.0;
app.ticker.add(delta => {
  elapsed += delta;
  if (elapsed > 60) {
    team.forEach(t => t.sprite.rotation = -t.sprite.rotation);
    elapsed = 0.0;
  }
});

/**
 * @param {AvatarEntity[]} team
 * @param {number} idx
 * @param {number} pos0q
 * @param {number} pos0r
 */
const exchangePlaces = (team, idx, pos0q, pos0r) => {
  [team[idx].hex.q, team[idx].hex.r] = [pos0q, pos0r];
  [team[idx], team[cur]] = [team[cur], team[idx]];
  cur = idx;
}

/**
 * @param {number} dq
 * @param {number} dr
 * @param {AvatarEntity[]} team
 */
const move = ([dq, dr], team) => {
  let [pos0q, pos0r] = [team[cur].hex.q, team[cur].hex.r];
  team[cur].hex.q += dq;
  team[cur].hex.r += dr;

  const idx = team.findIndex(c=>c!==team[cur] && c.hex.q===team[cur].hex.q && c.hex.r===team[cur].hex.r);
  if (idx > 0) return exchangePlaces(team, idx, pos0q, pos0r) // if the hex already had a unit, just exchange places

  const slices = [team.slice(0, cur).reverse(), team.slice(cur+1)]
      .sort((a,b)=>a.length-b.length);
  if (slices[0].length) // if it's in the middle of the line, also just exchange places
    return exchangePlaces(team, team.findIndex(c=>c===slices[0][0]), pos0q, pos0r);
  slices[1].forEach(c=> [c.hex.q, c.hex.r, pos0q, pos0r] = [pos0q, pos0r, c.hex.q, c.hex.r]);
}

const moveMap = { "w":[0, -1], "e":[1, -1], "d":[1, 0], "x":[0, 1], "z":[-1, 1], "a":[-1, 0] };
window.addEventListener("keydown", event => {
  const delta = moveMap[event.key]
  if (delta) { move(delta, team); updatePos(); }
}, false);