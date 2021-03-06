const app = new PIXI.Application({ width: 800, height: 600,
  backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1 });
document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

let cur = 0;
const SIZE = 96;
const team = ["lanka.png", "tartartaglia.png", "morax.png", "walnut.png"]
    .map(n => new PIXI.Sprite(PIXI.Texture.from(n)))
team.forEach((t, i) => {
  Object.assign(t, { x:0, y:i*SIZE, rotation:0.06, interactive:true });
  t.on('pointerdown', () => cur = team.findIndex(c=>c===t));
  t.anchor.set(0.5);
  // t.scale = 0.5;
  container.addChild(t);
});

// Move container to the center
container.x = SIZE/2;
container.y = SIZE/2;

let elapsed = 0.0;
app.ticker.add(delta => {
  elapsed += delta;
  if (elapsed > 60) {
    team.forEach(t => t.rotation = -t.rotation);
    elapsed = 0.0;
  }
});

const follow = (move) => {
  let [pos0x, pos0y] = [team[cur].x, team[cur].y];
  move(team[cur]);

  const idx = team.findIndex(c=>c!==team[cur] && c.x===team[cur].x && c.y===team[cur].y);
  if (idx > 0) {
    [team[idx].x, team[idx].y] = [pos0x, pos0y];
    [team[idx], team[cur]] = [team[cur], team[idx]];
    cur = idx;
    return;
  }

  const slices = [team.slice(0, cur).reverse(), team.slice(cur+1)]
      .sort((a,b)=>a.length-b.length);
  console.log(`slices: ${slices.map(s=>s.toString())}`);
  if (slices[0].length) {
    const idx2 = team.findIndex(c=>c===slices[0][0]);
    [team[idx2].x, team[idx2].y] = [pos0x, pos0y];
    [team[idx2], team[cur]] = [team[cur], team[idx2]];
    cur = idx2;
    return;
  }

  slices[1].forEach(c=> [c.x, c.y, pos0x, pos0y] = [pos0x, pos0y, c.x, c.y]);
}

window.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") follow(s=>s.x -= SIZE)
  if (event.key === "ArrowRight") follow(s=>s.x += SIZE)
  if (event.key === "ArrowUp") follow(s=>s.y -= SIZE)
  if (event.key === "ArrowDown") follow(s=>s.y += SIZE)
}, false);