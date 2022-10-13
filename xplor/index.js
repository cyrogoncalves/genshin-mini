import * as PIXI from "pixi.js";

/** @typedef AvatarEntity = { hex: {q:number, r:number} sprite: PIXI.Sprite } */

const app = new PIXI.Application({ width: 800, height: 600,
  backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1 });
document.body.appendChild(app.view);

const SIZE = 56;
const SQRT3 = Math.sqrt(3);

const container = new PIXI.Container();
Object.assign(container, { x:SIZE/2, y:SIZE/2, width:800, height:600 });
app.stage.addChild(container);

// container.interactive = true;
// const realPath = new PIXI.Graphics();
// app.stage.addChild(realPath)
// container.on('pointerdown', ev => {
//   let goal = { x:Math.floor(ev.data.global.x/SIZE), y:Math.floor(ev.data.global.y/SIZE) };
//   const start = { x:Math.floor(team[cur].x/SIZE), y:Math.floor(team[cur].y/SIZE) };
//   console.log({ev, start, goal});
//   // goal = {x:8, y:5}
//   if (goal.x === start.x && start.y === goal.y) return;
//   const path = omastar(start, goal);
//   console.log({path});
//   realPath.clear();
//   realPath.lineStyle(2, 0xFFFFFF, 1);
//   realPath.moveTo(team[cur].x, team[cur].y);
//   path.forEach(p => realPath.lineTo(p.x*SIZE, p.y*SIZE))
// });

let cur = 0;
/** @type AvatarEntity[] */
const team = ["lanka.png", "tartartaglia.png", "morax.png", "walnut.png"].map((n, i) => ({
  hex: { q:i+2, r:3 },
  sprite: new PIXI.Sprite(PIXI.Texture.from("../" + n))
}))
team.forEach(t => {
  Object.assign(t.sprite, { rotation:0.06, interactive:true });
  t.sprite.on('pointerdown', () => cur = team.findIndex(c=>c.sprite===t.sprite));
  t.sprite.anchor.set(0.5);
  t.sprite.
  // t.sprite.scale = 0.5;
  container.addChild(t.sprite);
});
const updatePos = () => team.forEach(t => {
  t.sprite.x = SIZE * (SQRT3 * t.hex.q + SQRT3 / 2 * t.hex.r);
  t.sprite.y = SIZE * 1.5 * t.hex.r
})
updatePos()

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