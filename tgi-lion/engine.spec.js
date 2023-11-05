import {Collei} from "./characters/collei.character.js";
import {Diluc} from "./characters/diluc.character.js";
import {ChangingShifts, strategize} from "./cards.js";
import * as engine from "./engine.js";

const PYRO = 0, DENDRO = 5, OMNI = 7

describe("engine", () => {
  it("opponent receives normal attack damage", () => {
    // todo log stream
    /** @type Deck */
    const deck1 = {userId: "0001", name: "deck1",
      characters: [{...Collei}, {...Diluc}], cards: [{...strategize}, {...ChangingShifts}]}
    /** @type Deck */
    const deck2 = {userId: "0002", name: "deck2",
      characters: [{...Collei}, {...Diluc}], cards: [{...ChangingShifts}]}
    /** @type Game */
    const game = engine.startGame(deck1, deck2)
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

  it("validates costs", () => {
    expect(engine.validateCost({"炎":3}, [PYRO, PYRO, PYRO])).toBeTruthy()
    expect(engine.validateCost({"炎":3}, [PYRO, PYRO, DENDRO])).toBeFalsy()
    expect(engine.validateCost({"炎":3}, [PYRO, PYRO, OMNI])).toBeTruthy()
    expect(engine.validateCost({"same":3}, [PYRO, PYRO, PYRO])).toBeTruthy()
    expect(engine.validateCost({"same":3}, [PYRO, PYRO, DENDRO])).toBeFalsy()
    expect(engine.validateCost({"same":3}, [PYRO, PYRO, OMNI])).toBeTruthy()
    expect(engine.validateCost({"same":3}, [OMNI, OMNI, OMNI])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, [PYRO, PYRO, PYRO])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, [PYRO, PYRO, DENDRO])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, [PYRO, PYRO, OMNI])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, [DENDRO, DENDRO, DENDRO])).toBeFalsy()
    expect(engine.validateCost({"炎":1,"any":2}, [DENDRO, OMNI, DENDRO])).toBeTruthy()
    expect(engine.validateCost({"炎":1,"any":2}, [DENDRO, OMNI])).toBeFalsy()
    expect(engine.validateCost({"炎":1,"any":2}, [DENDRO, OMNI, PYRO, OMNI])).toBeFalsy()
  })
});