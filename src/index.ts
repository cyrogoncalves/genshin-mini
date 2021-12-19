import chalk from "https://deno.land/x/chalk_deno@v4.1.1-deno/source/index.js";
import { Amber, Goomba, Kaeya, Lisa, Traveler, Team } from './mini.ts';
import { Encounter } from './encounter.ts';

const printEncounterState = (encounter: Encounter, out = console) => {
  out.log("");
  encounter.logs[encounter.logs.length - 1].forEach(r => out.log(r));
  const currentChar = encounter.team.myChars[encounter.team.cur || 0];
  const bench = encounter.team.myChars.filter(c => currentChar.name !== c.name).map(c => c.name).join(" ");
  const enemyCells = encounter.enemies.map(c => `${c.name}[${c.hp}/${c.maxHp}]`).join(" ");
  const charName = chalk.bold.red(currentChar.name);
  out.log(`${bench}\n- ${charName}[${currentChar.hp}/${currentChar.maxHp}] - ${enemyCells}`);
}

window.onload = () => {
  const team: Team = { myChars: [new Amber(), new Traveler(), new Lisa(), new Kaeya()] };
  const enemies = Array.from({ length:3 }, () => new Goomba());
  const encounter = new Encounter("You found 3 Goombas!", enemies, team);

  let quit = false;
  while (!quit) {
    try {
      printEncounterState(encounter);
      const command = prompt("What will Amber do? =>");
      if (command === "hit") {
        encounter.hit();
      } else if (command === "e") {
          encounter.hit("skill");
      } else if (command === "q") {
          encounter.hit("burst");
      } else if (command === "switch4") {
        team.cur = 3;
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
// deno run --no-check --allow-env --config ./tsconfig.json ./src/index.ts
