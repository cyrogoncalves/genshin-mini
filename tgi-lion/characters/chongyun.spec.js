import * as engine from "../engine";
import { Chongyun } from "./chongyun.character";
import { Diluc } from "./diluc.character";
import { Collei } from "./collei.character";
import { scamRolls } from "../testUtils";
import { Starsigns } from "../cards";

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

    it("other claymore char's normal atk deals 2氷 instead of 2", () => {
      engine.changeCharacter(game, [0], 1); // player 2 changes character to Diluc
      expect(game.curPlayerIdx).toBe(0); // passes turn
      expect(game.oppo.dice.length).toBe(7); // consumes dice

      engine.changeCharacter(game, [0], 1); // player 1 changes character to Diluc
      engine.attack(game, "0002", [0,1,2], 0)

      engine.attack(game, "0001", [0,1,2], 0)
      expect(game.player.char.hp).toBe(8); // deals *2氷*
      expect(game.player.char.elements[0]).toBe("氷"); // deals *2氷*
    })

    it("other non-melee char's normal atk still does 2", () => {
      engine.changeCharacter(game, [0], 2); // player 2 changes character to Collei
      engine.changeCharacter(game, [0], 2); // player 1 changes character to Collei
      engine.attack(game, "0001", [0,1,2], 0)

      engine.attack(game, "0002", [0,1,2], 0)
      expect(game.player.char.hp).toBe(8); // deals *2*
      expect(game.player.char.elements?.[0]).toBe(undefined); // no element aura
    })
  });

  describe("Elemental burst", () => {
    /** @type Card */
    const StarsignsOnSteroids = { ...Starsigns, cost: {}, effect: g => g.charge(5) }

    /** @type Game */
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Chongyun }], cards: [StarsignsOnSteroids] },
      { userId: "0002", name: "deck2", characters: [{ ...Chongyun }], cards: [] }
    ], scamRolls("omni"))
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    it("deals 7 cryo damage", () => {
      expect(game.player.char.energy).toBe(0); // energy empty
      engine.playCard(game, 0)
      expect(game.player.char.energy).toBe(3); // charges 3 energy
      engine.attack(game, "0001", [0,1,2], 2)
      expect(game.curPlayerIdx).toBe(1); // passes turn
      expect(game.oppo.dice.length).toBe(5); // consumes dice
      expect(game.player.char.hp).toBe(3); // deals damage
      expect(game.oppo.char.energy).toBe(0); // depletes energy
    })
  });
});