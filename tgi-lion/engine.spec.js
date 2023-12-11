import { Collei } from "./characters/collei.character.js";
import { Diluc } from "./characters/diluc.character.js";
import { ChangingShifts, Starsigns, Strategize } from "./cards.js";
import * as engine from "./engine.js";

describe("engine", () => {
  it("opponent receives normal attack damage", () => {
    // todo log stream
    /** @type Deck */
    const deck1 = {userId: "0001", name: "deck1",
      characters: [{...Collei}, {...Diluc}], cards: [{...Strategize}, {...ChangingShifts}]}
    /** @type Deck */
    const deck2 = {userId: "0002", name: "deck2",
      characters: [{...Collei}, {...Diluc}], cards: [{...ChangingShifts}]}
    /** @type Game */
    const game = engine.startGame([deck1, deck2])
    expect(game.canStart()).toBeFalsy();
    engine.chooseCharacter(game, "0001", 0)
    expect(game.canStart()).toBeFalsy();
    engine.chooseCharacter(game, "0002", 0)
    expect(game.canStart()).toBeTruthy();
    expect(game.player.dice.length).toBe(8); // rolls dice for first turn

    engine.attune(game, "0001", 7, 0)
    expect(game.player.dice[7]).toBe("草"); // changes die element
    expect(game.player.hand.length).toBe(1); // consumes card

    engine.attack(game, "0001", [0,1,7], 0)
    expect(game.oppo.dice.length).toBe(5); // consumes dice
    expect(game.player.char.hp).toBe(8); // deals damage
    expect(game.curPlayerIdx).toBe(1); // passes turn
    expect(game.oppo.char.energy).toBe(1); // charges energy

    engine.changeCharacter(game, [0])
    expect(game.oppo.dice.length).toBe(7); // consumes dice
    expect(game.oppo.curCharIdx).toBe(0); // changes character
    expect(game.curPlayerIdx).toBe(0); // passes turn

    // play "Changing Shifts"
    engine.playCard(game, 0)
    expect(game.player.hand.length).toBe(0); // discards card
    engine.changeCharacter(game, [])
    expect(game.oppo.dice.length).toBe(5); // doesn't consumes dice

  });

  it("charges energy for event card 'starsigns'", () => {
    const game = engine.startGame([
      { userId: "0001", name: "deck1", characters: [{ ...Collei }], cards: [Starsigns] },
      { userId: "0002", name: "deck2", characters: [{ ...Collei }], cards: [] }
    ])
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)

    // play "Starsigns"
    engine.playCard(game, 0, [0, 1])
    expect(game.player.hand.length).toBe(0); // discards card
    expect(game.player.dice.length).toBe(6); // consumes dice
    expect(game.curPlayerIdx).toBe(0); // doesn't pass turn
    expect(game.player.char.energy).toBe(1); // adds energy
  });

  it("validates costs", () => {
    expect(engine.validateCost({"炎":3}, ["炎", "炎", "炎"])).toBeTruthy()
    expect(engine.validateCost({"炎":3}, ["炎", "炎", "草"])).toBeFalsy()
    expect(engine.validateCost({"炎":3}, ["炎", "炎", "omni"])).toBeTruthy()
    expect(engine.validateCost({"same":3}, ["炎", "炎", "炎"])).toBeTruthy()
    expect(engine.validateCost({"same":3}, ["炎", "炎", "草"])).toBeFalsy()
    expect(engine.validateCost({"same":3}, ["炎", "炎", "omni"])).toBeTruthy()
    expect(engine.validateCost({"same":3}, ["omni", "omni", "omni"])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, ["炎", "炎", "炎"])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, ["炎", "炎", "草"])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, ["炎", "炎", "omni"])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, ["草", "草", "草"])).toBeFalsy()
    expect(engine.validateCost({"炎":1,"any":2}, ["草", "omni", "草"])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, ["草", "omni"])).toBeFalsy()
    expect(engine.validateCost({"炎":1,"any":2}, ["草", "omni", "炎", "omni"])).toBeFalsy()
  })
});