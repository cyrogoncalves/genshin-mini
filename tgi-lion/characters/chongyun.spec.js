import * as engine from "../engine";
import { Chongyun } from "./chongyun.character";
import { Diluc } from "./diluc.character";
import { Collei } from "./collei.character";
import { scamRolls } from "../testUtils";
import { changeCharacter } from "../engine";

describe("Chongyun", () => {
  describe("Normal attack", () => {
    /** @type Game */
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Chongyun }, { ...Diluc }], cards: [] },
      { userId: "0002", name: "deck2", characters: [{ ...Chongyun }, { ...Diluc }], cards: [] }
    ], scamRolls("氷"))
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    it("deals 2", () => {
      engine.attack(game, "0001", [0,1,2], 0)
      expect(game.curPlayerIdx).toBe(1); // passes turn
      expect(game.oppo.dice.length).toBe(5); // consumes dice
      expect(game.player.char.hp).toBe(8); // deals damage
      expect(game.oppo.char.energy).toBe(1); // charges energy
    });
  })

  describe("Elemental skill", () => {
    /** @type Game */
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Chongyun }, { ...Diluc }, { ...Collei }], cards: [] },
      { userId: "0002", name: "deck2", characters: [{ ...Chongyun }, { ...Diluc }, { ...Collei }], cards: [] }
    ], scamRolls("omni"))
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    it("deals 3 cryo damage", () => {
      engine.attack(game, "0001", [0,1,2], 1)
      expect(game.curPlayerIdx).toBe(1); // passes turn
      expect(game.oppo.dice.length).toBe(5); // consumes dice
      expect(game.player.char.hp).toBe(7); // deals damage
      expect(game.oppo.char.energy).toBe(1); // charges energy
    })

    it("passes turn and consumes dice", () => {
      engine.changeCharacter(game, [0], 1); // player 2 changes character to Diluc
      expect(game.curPlayerIdx).toBe(0); // passes turn
      expect(game.oppo.dice.length).toBe(7); // consumes dice

      engine.changeCharacter(game, [0], 1); // player 2 changes character to Diluc
      engine.attack(game, "0002", [0,1,2], 0)
    })

    it("other deals 2氷 instead of 2", () => {
      engine.attack(game, "0001", [0,1,2], 0)
      expect(game.player.char.hp).toBe(8); // deals *2氷*
      expect(game.player.char.elements[0]).toBe("氷"); // deals *2氷*
    })
  });
});