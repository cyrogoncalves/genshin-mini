import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { kokomiBanner, gachaPull, UserHistory } from "./gacha.ts"

Deno.test("Pull 3 star", () => {
  const hist : UserHistory = {
    5: { counter: 0, poolCounter: 0 },
    4: { counter: 0, poolCounter: 0 },
    3: { counter: 0, poolCounter: 0 }
  };
  const name = gachaPull(hist, kokomiBanner, 0.1);
  assertEquals(name, "Recurve Bow");
});
// deno test --no-check src/gacha.test.ts