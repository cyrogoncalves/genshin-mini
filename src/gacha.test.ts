import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { kokomiBanner, gachaPull, UserHistory } from "./gacha.ts"

const createHistory = (): UserHistory => ({
  5: { counter: 0, poolCounter: 0 },
  4: { counter: 0, poolCounter: 0 },
  3: { counter: 0, poolCounter: 0 }
});

Deno.test("Pull 3 star", () => {
  const hist = createHistory();
  const name = gachaPull(hist, kokomiBanner, .1);
  assertEquals(name, "Recurve Bow");
});
Deno.test("Pull feature 4 star without pity", () => {
  const hist = createHistory();
  const name = gachaPull(hist, kokomiBanner, .04, .1, .1);
  assertEquals(name, "Xingqiu");
});
Deno.test("Pull 3 star on 8th pull", () => {
  const hist = createHistory();
  hist[4].counter = 7;
  const name = gachaPull(hist, kokomiBanner, .1);
  assertEquals(name, "Recurve Bow");
});
Deno.test("Pull feature 4 star on 9th pull", () => {
  const hist = createHistory();
  hist[4].counter = 8;
  const name = gachaPull(hist, kokomiBanner, .1, .1, .1);
  assertEquals(name, "Xingqiu");
});
Deno.test("Pull 3 star on 9th pull", () => {
  const hist = createHistory();
  hist[4].counter = 8;
  const name = gachaPull(hist, kokomiBanner, .7);
  assertEquals(name, "Recurve Bow");
});
Deno.test("Pull guaranteed 4 star on 10th pull", () => {
  const hist = createHistory();
  hist[4].counter = 9;
  const name = gachaPull(hist, kokomiBanner, 1, .1, .1);
  assertEquals(name, "Xingqiu");
});
Deno.test("Pull basic 4 star without pool pity", () => {
  const hist = createHistory();
  const name = gachaPull(hist, kokomiBanner, .04, .6, .01);
  assertEquals(name, "Amber");
});
Deno.test("Pull guaranteed feature 4 star on pool pity", () => {
  const hist = createHistory();
  hist[4].poolCounter = 1;
  const name = gachaPull(hist, kokomiBanner, .04, .6, .01);
  assertEquals(name, "Xingqiu");
});

// deno test --no-check src/gacha.test.ts