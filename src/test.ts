import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { Encounter, amber, lumine, Goomba, Hilichurl } from './mini.ts';

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
  const team = { myChars: [{...amber}, {...lumine}] };
  const enemies = Array.from({ length:4 }, () => new Hilichurl());
  const encounter = new Encounter("You found 4 Hilichurls!", enemies, team);

  encounter.hit(team.myChars[0], encounter.enemies[1], "burst");
  assertEquals(team.myChars[0].hp, 9);
  assertEquals(enemies.map(e => e.hp), [3, 3, 3, 5]);
  assertEquals(!!enemies[0].infusions["Pyro"], true);
  assertEquals(!!enemies[1].infusions["Pyro"], true);
  assertEquals(!!enemies[2].infusions["Pyro"], true);
  assertEquals(!!enemies[3].infusions["Pyro"], false);

  encounter.hit(team.myChars[1], encounter.enemies[0], "burst");
  assertEquals(enemies.map(e => e.hp), [1, 1, 1, 4]);
  assertEquals(!!enemies[0].infusions["Pyro"], true);
  assertEquals(!!enemies[1].infusions["Pyro"], true);
  assertEquals(!!enemies[2].infusions["Pyro"], true);
  assertEquals(!!enemies[3].infusions["Pyro"], true);
});

// deno test --no-check