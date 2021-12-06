import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { Amber, Traveler, Lisa, Kaeya, Ningguang, Goomba, Hilichurl } from './mini.ts';
import { Encounter } from './encounter.ts';

Deno.test("Amber hits goombas", () => {
  const team = { myChars: [new Amber()] };
  const enemies = Array.from({ length:3 }, () => new Goomba());
  const encounter = new Encounter("You found 3 Goombas!", enemies, team);

  encounter.hit();
  assertEquals(team.myChars[0].hp, 9);
  assertEquals(encounter.enemies[0].hp, 1);

  encounter.hit();
  assertEquals(encounter.enemies.length, 2);

  encounter.hit();
  encounter.hit();
  encounter.hit();
  encounter.hit();
  assertEquals(encounter.enemies.length, 0);
  assertEquals(encounter.over, true);
});

Deno.test("Goombas drop Amber", () => {
  const team = { myChars: [new Amber()] };
  const enemies = Array.from({ length:3 }, () => new Goomba());
  const encounter = new Encounter("You found 3 Goombas!", enemies, team);
  team.myChars[0].hp = 1;

  encounter.hit();
  assertEquals(encounter.over, true);
});

Deno.test("Amber ults on Hilichurls", () => {
  const team = { myChars: [new Amber()] };
  const enemies = Array.from({ length:4 }, () => new Hilichurl());
  const encounter = new Encounter("You found 4 Hilichurls!", enemies, team);

  encounter.hit("burst", encounter.enemies[1]);
  assertEquals(team.myChars[0].hp, 9);
  assertEquals(enemies.map(e => e.hp), [3, 3, 3, 5]);

  encounter.hit("burst");
  assertEquals(enemies.map(e => e.hp), [1, 1, 3, 5]);
});

Deno.test("Amber ults then Lumine ults on Hilichurls", () => {
  const team = { myChars: [new Amber(), new Traveler(), new Lisa(), new Kaeya()], cur: 0 };
  const enemies = Array.from({ length:5 }, () => new Hilichurl(9));
  const encounter = new Encounter("You found 5 Hilichurls!", enemies, team);

  // [Am .. .. ..]   [t  T  t  .  . ]
  //                 [P  P  P  .  . ]
  encounter.hit("burst", encounter.enemies[1]);
  assertEquals(enemies.map(e => e.hp), [7, 7, 7, 9, 9]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, true, false, false]);

  // [.. .. Li ..]   [.  .  .  T  . ]
  //                 [P  P  P  E  . ]
  team.cur = 2;
  encounter.hit("normal", encounter.enemies[3]);
  assertEquals(enemies.map(e => e.hp), [7, 7, 7, 8, 9]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, true, false, false]);
  assertEquals(enemies.map(e => !!e.infusions["Electro"]), [false, false, false, true, false]);

  // swirl, spread, overload
  // [.. Lu .. ..]   [t  t  t  t  t ]
  //                 [Ps Ps Ov Es E ]
  team.cur = 1;
  encounter.hit("burst");
  assertEquals(enemies.map(e => e.hp), [5, 5, 4, 5, 8]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, false, false, false]);
  assertEquals(enemies.map(e => !!e.infusions["Electro"]), [false, false, false, false, true]);
});

Deno.test("Melt", () => {
  const team = { myChars: [new Amber(), new Kaeya()], cur: 0 };
  const enemies = Array.from({ length:5 }, () => new Hilichurl(9));
  const encounter = new Encounter("You found 5 Hilichurls!", enemies, team);

  // reverse melt
  encounter.hit("burst", encounter.enemies[1]);
  team.cur = 1;
  encounter.hit("skill", encounter.enemies[2]);
  assertEquals(enemies.map(e => e.hp), [7, 7, 4, 7, 9]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, true, false, false]);
  assertEquals(enemies.map(e => !!e.infusions["Cryo"]), [false, false, false, true, false]);

  // second reverse melt
  encounter.hit("skill", encounter.enemies[1]);
  assertEquals(enemies.map(e => e.hp), [7, 4, 1, 7, 9]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, false, false, false]);
  assertEquals(enemies.map(e => !!e.infusions["Cryo"]), [false, false, false, true, false]);

  // melt
  team.cur = 0;
  encounter.hit("burst", encounter.enemies[4]);
  assertEquals(enemies.map(e => e.hp), [7, 4, 1, 3, 7]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, false, false, true]);
  assertEquals(enemies.map(e => !!e.infusions["Cryo"]), [false, false, false, false, false]);
});

Deno.test("Cristalize", () => {
  const amber = new Amber();
  const ning = new Ningguang();
  const team: any = { myChars: [amber, ning], shields: {}, cur: 0 };
  const enemies = Array.from({ length:5 }, () => new Hilichurl(9));
  const encounter = new Encounter("You found 5 Hilichurls!", enemies, team);

  encounter.hit("burst", encounter.enemies[1]);
  team.cur = 1;
  encounter.hit();
  assertEquals(enemies.map(e => e.hp), [6, 7, 7, 9, 9]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, true, false, false]);
  assertEquals(ning.hp, 9);
  assertEquals(team.shields.cristalize, { type: "Pyro", hp: 1, cooldown: 2 });

  encounter.hit();
  assertEquals(enemies.map(e => e.hp), [5, 7, 7, 9, 9]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [false, true, true, false, false]);
  assertEquals(ning.hp, 9);
  assertEquals(team.shields.cristalize, { type: "Pyro", hp: 1, cooldown: 2 });
});

// deno test --no-check