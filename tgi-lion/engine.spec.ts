import {Collei} from "./collei.character.js";
import {Diluc} from "./diluc.character.js";
import {ChangingShifts, strategize} from "./cards.js";
import * as engine from "./engine.js";
import {DENDRO} from "./model.js";

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
    expect(game.player.dice[7]).toBe(DENDRO); // changes die element
    expect(game.player.hand.length).toBe(1); // consumes card

    engine.attack(game, "0001", [0,1,7], 0)
    expect(game.oppo.dice.length).toBe(5); // consumes dice
    expect(game.player.char.hp).toBe(8); // deals damage
    expect(game.curPlayerIdx).toBe(1); // passes turn

    engine.changeCharacter(game, [0])
    expect(game.oppo.dice.length).toBe(7); // consumes dice
    expect(game.oppo.curCharIdx).toBe(0); // changes character
    expect(game.curPlayerIdx).toBe(0); // passes turn

    engine.playCard(game, 0)
    expect(game.player.hand.length).toBe(0); // discards card
    engine.changeCharacter(game, [])
    expect(game.oppo.dice.length).toBe(5); // doesn't consumes dice
  });
});