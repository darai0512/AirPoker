import AirPoker from '../../main/logic/airpoker.js';
import {SUITS} from "../../main/logic/trump_framework/card.js";

const players = ['a', 'b'];
let airPoker = new AirPoker(players);
let expect = require('chai').expect;

describe("In AirPoker class", function() {
  describe("getMaxRaise function", function() {
    it("should return the number of half of total bet", function() {
      expect(airPoker.getMaxRaise()).to.equal(0);
    });
  });
  describe("getFlashSuit_ function", function() {
    let testNumbers = [1, 2, 3, 4, 5];
    it("should return an available suit from remaining cards", function() {
      let suitKeys = Object.keys(SUITS);
      expect(SUITS[suitKeys[0]] === airPoker.getFlashSuit_(testNumbers)).to.be.true;
    });
    it("should be null due to lack of available suits", function() {
      airPoker.remainingCards[5] = [];
      expect(airPoker.getFlashSuit_(testNumbers)).to.be.null;
    });
  });
  describe("useCard_ function", function() {
    it("should return the number of half of total bet", function() {
      //airPoker.judge().should.be.equal(0);
    });
  });
  describe("judge function", function() {
    it("should return the number of half of total bet", function() {
      //airPoker.judge().should.be.equal(0);
    });
  });
});
