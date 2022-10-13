// https://www.redblobgames.com/grids/hexagons/
import * as PIXI from "pixi.js";
// import {Application} from "pixi.js";

// // util
// const ticker = (app: PIXI.Application, time: number, fn, elapsed = 0.0) => app.ticker.add(delta => {
//     elapsed += delta;
//     if (elapsed > time) {
//         team.forEach(t => t.rotation = -t.rotation);
//         elapsed = 0.0;
//     }
// });

type AvatarEntity = {
    hex: {q:number, r:number}
    sprite: PIXI.Sprite
}

const app = new PIXI.Application({ width: 800, height: 600,
    backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1 });
document.body.appendChild(app.view);

const SIZE = 96;

const container = new PIXI.Container();
container.x = SIZE/2;
container.y = SIZE/2;
container.width=800
container.height=600
app.stage.addChild(container);

let q = 2
let cur = 0;
const team: AvatarEntity[] = ["lanka.png", "tartartaglia.png", "morax.png", "walnut.png"].map(n => ({
    hex: { q:q++, r:3 },
    sprite: new PIXI.Sprite(PIXI.Texture.from("../" + n))
}))
team.forEach((t, i) => {
    Object.assign(t.sprite, { rotation:0.06, interactive:true });
    t.sprite.on('pointerdown', () => cur = team.findIndex(c=>c.sprite===t.sprite));
    t.sprite.anchor.set(0.5);
    // t.sprite.scale = 0.5;
    container.addChild(t.sprite);
});
const SQRT3 = Math.sqrt(3);
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

const move = ([dq, dr]: number[], team: AvatarEntity[], cur: number) => {
    let [pos0q, pos0r] = [team[cur].hex.q, team[cur].hex.r];
    [team[cur].hex.q, team[cur].hex.r] = [dq, dr]

    const idx = team.findIndex(c=>c!==team[cur] && c.hex.q===team[cur].hex.q && c.hex.r===team[cur].hex.r);
    if (idx > 0) { // if the hex already had a unit, just exchange places
        [team[idx].hex.q, team[idx].hex.r] = [pos0q, pos0r];
        [team[idx], team[cur]] = [team[cur], team[idx]];
        cur = idx;
    } else {
        const slices = [team.slice(0, cur).reverse(), team.slice(cur+1)]
            .sort((a,b)=>a.length-b.length);
        if (slices[0].length) {
            const idx2 = team.findIndex(c => c === slices[0][0]);
            [team[idx2].hex.q, team[idx2].hex.r] = [pos0q, pos0r];
            [team[idx2], team[cur]] = [team[cur], team[idx2]];
            cur = idx2;
            return;
        } else {
            slices[1].forEach(c=> [c.hex.q, c.hex.r, pos0q, pos0r] = [pos0q, pos0r, c.hex.q, c.hex.r]);
        }
    }

    updatePos()
}

window.addEventListener("keydown", event => {
    switch (event.key) {
        case "w": return move([0, -1], team, cur);
        case "e": return move([1, -1], team, cur);
        case "d": return move([1, 0], team, cur);
        case "x": return move([0, 1], team, cur);
        case "z": return move([-1, 1], team, cur);
        case "a": return move([-1, 0], team, cur);
    }
}, false);