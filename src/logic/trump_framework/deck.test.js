import Deck from "../../../main/logic/trump_framework/deck.js";

const deck = new Deck({'deckNum': 1, 'jockerNum': 0});
const should = require('chai').should();

describe("Deck framework test", () => {
  describe("In showTop function", () => {
    it("should return card object", () => {
      const card = deck.showTop();
      card.should.be.an('object');
      card.should.include.keys('number', 'suit');
    });
  });
});
