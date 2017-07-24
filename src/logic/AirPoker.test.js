import AirPoker from './AirPoker';
import {SUITS} from "./trump_framework/card.js";

const players = ['a', 'b'];
const airPoker = new AirPoker(players);
const expect = require('chai').expect;

describe("In AirPoker class", () => {
  describe("getMaxRaise function", () => {
    it("should return the number of half of total bet", () => {
      expect(airPoker.getMaxRaise()).to.equal(0);
    });
  });
  describe("getFlashSuit_ function", () => {
    const testNumbers = [1, 2, 3, 4, 5];
    it("should return an available suit from remaining cards", () => {
      const suitKeys = Object.keys(SUITS);
      expect(SUITS[suitKeys[0]] === airPoker.getFlashSuit_(testNumbers)).to.be.true;
    });
    it("should be null due to lack of available suits", () => {
      airPoker.remainingCards[5] = [];
      expect(airPoker.getFlashSuit_(testNumbers)).to.be.null;
    });
  });
  describe("useCard_ function", () => {
    it("should return the number of half of total bet", () => {
      // airPoker.judge().should.be.equal(0);
    });
  });
  describe("judge function", () => {
    it("should return the number of half of total bet", () => {
      // airPoker.judge().should.be.equal(0);
    });
  });
});
