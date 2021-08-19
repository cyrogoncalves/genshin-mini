import { Encounter, amber, Goomba } from './mini.ts';

window.onload = async () => {
  const team = {
    myChars: [amber]
  };
  const enemies = Array.from({ length:3 }, () => new Goomba());
  const encounter = new Encounter("You found 3 Goombas!", enemies, team);

  let quit = false;
  while (!quit) {
    try {
      encounter.printState();
      const command = prompt("What will Amber do? => ");
      if (command === "hit") {
        encounter.hit(team.myChars[0], encounter.enemies[0]);
      } else if (command === "quit") {
        quit = true;
      }
    } catch (err) {
      console.error(err);
      quit = true;
    }
  }
}
// ts-node src/index.ts
// deno run --config ./tsconfig.json ./src/index.ts