import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { Encounter, amber, lumine, lisa, Goomba, Hilichurl } from './mini.ts';

Deno.test("Amber hits goombas", () => {
  const team = { myChars: [{...amber}] };
  const enemies = Array.from({ length:3 }, () => new Goomba());
  const encounter = new Encounter("You found 3 Goombas!", enemies, team);

  encounter.hit(team.myChars[0], encounter.enemies[0]);
  assertEquals(team.myChars[0].hp, 9);
  assertEquals(encounter.enemies[0].hp, 1);

  encounter.hit(team.myChars[0], encounter.enemies[0]);
  assertEquals(encounter.enemies.length, 2);

  encounter.hit(team.myChars[0], encounter.enemies[0]);
  encounter.hit(team.myChars[0], encounter.enemies[0]);
  encounter.hit(team.myChars[0], encounter.enemies[0]);
  encounter.hit(team.myChars[0], encounter.enemies[0]);
  assertEquals(encounter.enemies.length, 0);
  assertEquals(encounter.over, true);
});

Deno.test("Goombas drop Amber", () => {
  const team = { myChars: [{...amber}] };
  const enemies = Array.from({ length:3 }, () => new Goomba());
  const encounter = new Encounter("You found 3 Goombas!", enemies, team);
  team.myChars[0].hp = 1;

  encounter.hit(team.myChars[0], encounter.enemies[0]);
  assertEquals(encounter.over, true);
});

Deno.test("Amber ults on Hilichurls", () => {
  const team = { myChars: [{...amber}] };
  const enemies = Array.from({ length:4 }, () => new Hilichurl());
  const encounter = new Encounter("You found 4 Hilichurls!", enemies, team);

  encounter.hit(team.myChars[0], encounter.enemies[1], "burst");
  assertEquals(team.myChars[0].hp, 9);
  assertEquals(enemies.map(e => e.hp), [3, 3, 3, 5]);

  encounter.hit(team.myChars[0], encounter.enemies[0], "burst");
  assertEquals(enemies.map(e => e.hp), [1, 1, 3, 5]);
});

Deno.test("Amber ults then Lumine ults on Hilichurls", () => {
  const team = { myChars: [{...amber}, {...lumine}, {...lisa}] };
  const enemies = Array.from({ length:5 }, () => new Hilichurl());
  enemies.forEach(e => e.hp = 9);
  const encounter = new Encounter("You found 5 Hilichurls!", enemies, team);

  encounter.hit(team.myChars[0], encounter.enemies[1], "burst");
  assertEquals(enemies.map(e => e.hp), [7, 7, 7, 9, 9]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, true, false, false]);

  encounter.hit(team.myChars[2], encounter.enemies[3]);
  assertEquals(enemies.map(e => e.hp), [7, 7, 7, 8, 9]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, true, false, false]);
  assertEquals(enemies.map(e => !!e.infusions["Electro"]), [false, false, false, true, false]);

  encounter.hit(team.myChars[1], encounter.enemies[0], "burst");
  assertEquals(enemies.map(e => e.hp), [5, 5, 4, 5, 8]);
  assertEquals(enemies.map(e => !!e.infusions["Pyro"]), [true, true, false, false, false]);
  assertEquals(enemies.map(e => !!e.infusions["Electro"]), [false, false, false, false, true]);
});

// deno test --no-check