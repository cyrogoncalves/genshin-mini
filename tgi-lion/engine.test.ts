import { assertEquals } from "https://deno.land/std@0.105.0/testing/asserts.ts";
import {Card, Deck, DieFace, Player, Summon, TGICharacter} from "./model";
import {Collei} from "./collei.character";
import {strategize} from "./cards";
import * as engine from "./engine";

Deno.test("opponent receives normal attack damage", () => {
  // todo log stream
  const deck1: Deck = {userId: "0001", name: "deck1", characters: [{...Collei}], cards: [{...strategize}]}
  const deck2: Deck = {userId: "0002", name: "deck2", characters: [{...Collei}], cards: [{...strategize}]}
  const game = engine.startGame(deck1, deck2)
  engine.chooseCharacter(game, "0001", 0)
  engine.chooseCharacter(game, "0002", 0)
  assertEquals(game.canStart(), true);
  assertEquals(game.curPlayer.dice.length, 8);

  engine.attune(game, "0001", 7)
  assertEquals(game.curPlayer.dice[7], "D");

  engine.attack(game, "0001", [0,1,7], 0)
  assertEquals(game.curPlayer.dice.length, 5);
  assertEquals(game.currentOpposingChar.hp, 8);
  assertEquals(game.curPlayerIdx, 1);
});