import * as engine from "../engine";
import { Collei } from "./collei.character";
import { scamRolls } from "../testUtils";
import { Starsigns } from "../cards";

describe("Collei", () => {
  describe("Normal attack", () => {
    /** @type Game */
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Collei }], cards: [] },
      { userId: "0002", name: "deck2", characters: [{ ...Collei }], cards: [] }
    ], scamRolls("草"))
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
      { userId: "0001", name: "deck1", characters: [{ ...Collei }], cards: [] },
      { userId: "0002", name: "deck2", characters: [{ ...Collei }], cards: [] }
    ], scamRolls("omni"))
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    it("deals 3 dendro damage", () => {
      engine.attack(game, "0001", [0,1,2], 1)
      expect(game.curPlayerIdx).toBe(1); // passes turn
      expect(game.oppo.dice.length).toBe(5); // consumes dice
      expect(game.player.char.hp).toBe(7); // deals damage
      expect(game.oppo.char.energy).toBe(1); // charges energy
      expect(game.player.char.elements[0]).toBe("草"); // applies dendro
    })
  });

  describe("Elemental burst", () => {
    /** @type Card */
    const StarsignsOnSteroids = { ...Starsigns, cost: {}, effect: g => g.charge(5) }

    /** @type Game */
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Collei }], cards: [StarsignsOnSteroids] },
      { userId: "0002", name: "deck2", characters: [{ ...Collei }], cards: [] }
    ], scamRolls("omni"))
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    it("deals 2 dendro damage", () => {
      engine.playCard(game, 0)
      engine.attack(game, "0001", [0,1,2], 2)
      expect(game.curPlayerIdx).toBe(1); // passes turn
      expect(game.oppo.dice.length).toBe(5); // consumes dice
      expect(game.char.hp).toBe(8); // deals 2 damage
      expect(game.oppo.char.energy).toBe(0); // depletes energy
      expect(game.oppo.summons.length).toBe(1); // summons
    })

    it("deals 2 dendro damage at end of turn", () => {
      engine.endTurn(game)
      engine.endTurn(game)
      expect(game.curPlayerIdx).toBe(1); // player 2 starts, for ending turn first
      expect(game.oppo.dice.length).toBe(8); // consumes dice
      expect(game.char.hp).toBe(8); // deals 2草 damage
      expect(game.oppo.char.energy).toBe(0); // depletes energy
    })
  });
});