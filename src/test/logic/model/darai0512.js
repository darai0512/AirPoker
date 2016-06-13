'use strict'
import Model from '../../../main/logic/model/darai0512.js';
let model = new Model();
let should = require('chai').should();

describe("'darai0512' Model's test", function() {
  describe("In setCard function", function() {
    it("should return a first index of the first argument's array", function() {
      model.setCard([6], {}).should.be.equal(6);
    });
  });
  describe("In bet function", function() {
    it("should call when the opponent action is raise", function() {
      const got = model.bet(6, "raise", 1, 24, 25);
      got.action.should.be.equal("call");
      got.tip.should.be.equal(0);
    });
    it("should check when the opponent action is check", function() {
      const got = model.bet(6, "check", 1, 24, 25);
      got.action.should.be.equal("check");
      got.tip.should.be.equal(0);
    });
  });
});
