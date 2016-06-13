import Deck from "../../../main/logic/trump_framework/deck.js";
let deck = new Deck({'deckNum': 1, 'jockerNum': 0});
let should = require('chai').should();

describe("Deck framework test", function() {
  describe("In showTop function", function() {
    it("should return card object", function() {
      const card = deck.showTop();
      card.should.be.an('object');
      card.should.include.keys('number', 'suit');
    });
  });
});
