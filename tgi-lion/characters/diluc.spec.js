import * as engine from "../engine";
import { Chongyun } from "./chongyun.character";
import { Diluc } from "./diluc.character";
import { Collei } from "./collei.character";
import { scamRolls } from "../testUtils";
import { Starsigns } from "../cards";

describe("Diluc", () => {
  describe("Normal attack", () => {
    /** @type Game */
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Diluc }], cards: [] },
      { userId: "0002", name: "deck2", characters: [{ ...Diluc }], cards: [] }
    ], scamRolls("炎"))
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
      { userId: "0001", name: "deck1", characters: [{ ...Diluc }, { ...Collei }], cards: [] },
      { userId: "0002", name: "deck2", characters: [{ ...Diluc }, { ...Collei }], cards: [] }
    ], scamRolls("omni"))
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    it("deals 3 pyro damage", () => {
      engine.attack(game, "0001", [0,1,2], 1)
      expect(game.curPlayerIdx).toBe(1); // passes turn
      expect(game.oppo.dice.length).toBe(5); // consumes dice
      expect(game.player.char.hp).toBe(7); // deals damage
      expect(game.oppo.char.energy).toBe(1); // charges energy
      expect(game.player.char.elements[0]).toBe("炎"); // applies cryo
    })

    it("second attack deals 5 instead of 3", () => {
      engine.attack(game, "0002", [0,1,2], 0)

      engine.attack(game, "0001", [0,1,2], 1)
      expect(game.player.char.hp).toBe(2); // deals *5*
      expect(game.player.char.elements[0]).toBe("炎"); // deals *2氷*
    })
  });

  describe("Elemental burst", () => {
    /** @type Card */
    const StarsignsOnSteroids = { ...Starsigns, cost: {}, effect: g => g.charge(5) }

    /** @type Game */
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Diluc }], cards: [StarsignsOnSteroids] },
      { userId: "0002", name: "deck2", characters: [{ ...Diluc }], cards: [] }
    ], scamRolls("omni"))
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    it("deals 8 pyro damage", () => {
      engine.playCard(game, 0)
      engine.attack(game, "0001", [0,1,2], 2)
      expect(game.curPlayerIdx).toBe(1); // passes turn
      expect(game.oppo.dice.length).toBe(5); // consumes dice
      expect(game.player.char.hp).toBe(2); // deals damage
      expect(game.oppo.char.energy).toBe(0); // depletes energy
    })
  });
});