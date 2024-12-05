const assert = require('assert').strict;
const gameController = require("../GameController/gameController.js");
const letters = require("../GameController/letters.js");
const position = require("../GameController/position.js");

describe('checkIsHitTests', function () {

  it('should return true for isShotOnTarget if there is a ship at the shooting position', function () {
    var ships = gameController.InitializeShips();
    counter = 1;
    ships.forEach(ship => {
      for (var i = 1; i <= ship.size; i++) {
        column = letters.get(counter);
        ship.addPosition(new position(letters.get(counter), i));
      }
      counter++;
    });
    var result = gameController.CheckIsHit(ships, new position(letters.A, 1));
    assert.strictEqual(result.isShotOnTarget, true, "shot was not on target");
    assert.strictEqual(result.isNewHit, true, "shot was not a new hit");
  });

  it('should return false for isShotOnTarget if there is no ship at the shooting position', function () {
    var ships = gameController.InitializeShips();
    counter = 1;
    ships.forEach(ship => {
      for (var i = 1; i <= ship.size; i++) {
        ship.addPosition(new position(letters.get(counter), i));
      }
      counter++;
    });
    var result = gameController.CheckIsHit(ships, new position(letters.G, 1));
    assert.strictEqual(result.isShotOnTarget, false);
    assert.strictEqual(result.isNewHit, false);
  });

  it('should throw an exception if position is undefined', function () {
    var ships = gameController.InitializeShips();
    assert.throws(
      () => {
        gameController.CheckIsHit(ships, undefined);
      },
      /The shooting position is not defined/ // Check for the specific error message
    );
  });

  it('should throw an exception if ships is undefined', function () {
    assert.throws(
      () => {
        gameController.CheckIsHit(undefined, new position(letters.G, 1));
      },
      /No ships defined/ // Check for the specific error message
    );
  });

  it('should return false for isNewHit if the position was already hit', function () {
    var ships = gameController.InitializeShips();
    counter = 1;
    ships.forEach(ship => {
      for (var i = 1; i <= ship.size; i++) {
        column = letters.get(counter);
        ship.addPosition(new position(letters.get(counter), i));
      }
      counter++;
    });

    // First hit
    var firstResult = gameController.CheckIsHit(ships, new position(letters.A, 1));
    assert.strictEqual(firstResult.isShotOnTarget, true, "First hit was not on target");
    assert.strictEqual(firstResult.isNewHit, true, "First hit was not a new hit");

    // Second hit at the same position
    var secondResult = gameController.CheckIsHit(ships, new position(letters.A, 1));
    assert.strictEqual(secondResult.isShotOnTarget, true, "Second hit was not on target");
    assert.strictEqual(secondResult.isNewHit, false, "Second hit was incorrectly marked as new");

    // Third hit at the same position
    var thirdResult = gameController.CheckIsHit(ships, new position(letters.A, 1));
    assert.strictEqual(thirdResult.isShotOnTarget, true, "Third hit was not on target");
    assert.strictEqual(thirdResult.isNewHit, false, "Third hit was incorrectly marked as new");
  });

});
