import * as engine from "../engine";
import { Chongyun } from "./chongyun.character";
import { Collei } from "./collei.character";
import { scamRolls } from "../testUtils";

describe("engine", () => {
  it("opponent receives normal attack damage", () => {
    /** @type Game */
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Chongyun }, { ...Collei }], cards: [] },
      { userId: "0002", name: "deck2", characters: [{ ...Chongyun }, { ...Collei }], cards: [] }
    ], scamRolls("氷"))
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    // normal attack - deal 2 physycal damage
    engine.attack(game, "0001", [0,1,2], 0)
    expect(game.oppo.dice.length).toBe(5); // consumes dice
    expect(game.player.char.hp).toBe(8); // deals damage
    expect(game.curPlayerIdx).toBe(1); // passes turn
    expect(game.oppo.char.energy).toBe(1); // charges energy

    // elemental skill - 3氷 and infusion
    engine.attack(game, "0002", [0,1,2], 1)
    expect(game.oppo.dice.length).toBe(5); // consumes dice
    expect(game.player.char.hp).toBe(7); // deals damage
    expect(game.curPlayerIdx).toBe(0); // passes turn
    expect(game.oppo.char.energy).toBe(1); // charges energy
  });
});