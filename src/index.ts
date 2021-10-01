import { Goomba } from './mini.ts';
import { Encounter } from './encounter.ts';

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


let person = 'Mike';
let age = 28;

function myTag(strings, personExp, ageExp) {
  let str0 = strings[0]; // "That "
  let str1 = strings[1]; // " is a "
  let str2 = strings[2]; // "."

  let ageStr = ageExp > 99 ? 'centenarian' : 'youngster';

  // We can even return a string built using a template literal
  return `${str0}${personExp}${str1}${ageStr}${str2}`;
}

let output = myTag`That ${ person } is a ${ age }.`;

console.log(output);
// That Mike is a youngster.