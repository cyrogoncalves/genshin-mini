import {Collei} from "./collei.character.js";
import {strategize} from "./cards.js";
import * as engine from "./engine.js";
import {DENDRO} from "./model.js";

describe('engine', () => {
  it("opponent receives normal attack damage", () => {
    // todo log stream
    /** @type Deck */
    const deck1 = {userId: "0001", name: "deck1",
      characters: [{...Collei}], cards: [{...strategize}]}
    /** @type Deck */
    const deck2 = {userId: "0002", name: "deck2",
      characters: [{...Collei}], cards: [{...strategize}]}
    /** @type Game */
    const game = engine.startGame(deck1, deck2)
    engine.chooseCharacter(game, "0001", 0)
    engine.chooseCharacter(game, "0002", 0)
    expect(game.canStart()).toBeTruthy();
    expect(game.player.dice.length).toBe(8);

    engine.attune(game, "0001", 7)
    expect(game.player.dice[7]).toBe(DENDRO);

    engine.attack(game, "0001", [0,1,7], 0)
    expect(game.oppo.dice.length).toBe(5);
    expect(game.player.char.hp).toBe(8);
    expect(game.curPlayerIdx).toBe(1);
  });
});