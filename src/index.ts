import {Amber, Goomba, Kaeya, Lisa, Traveler} from './mini.ts';
import { Encounter } from './encounter.ts';

window.onload = async () => {
  const team = { myChars: [new Amber(), new Traveler(), new Lisa(), new Kaeya()] };
  const enemies = Array.from({ length:3 }, () => new Goomba());
  const encounter = new Encounter("You found 3 Goombas!", enemies, team);

  let quit = false;
  while (!quit) {
    try {
      encounter.printState();
      const command = prompt("What will Amber do? =>");
      if (command === "hit") {
        encounter.hit(team.myChars[0], encounter.enemies[0]);
      } else if (command === "e") {
          encounter.hit(team.myChars[0], encounter.enemies[0], "skill");
      } else if (command === "q") {
          encounter.hit(team.myChars[0], encounter.enemies[0], "burst");
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
// deno run --no-check --config ./tsconfig.json ./src/index.ts
