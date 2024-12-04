const assert = require('assert').strict;
const gameController = require("../GameController/gameController.js");
const letters = require("../GameController/letters.js");
const position = require("../GameController/position.js")
const ship = require("../GameController/ship");

describe('isShipValidTests', function () {

  it('should return true if the ship is valid', function () {
    var testship = new ship("Battleship", 3, 0);
    testship.addPosition(new position(letters.A, 1));
    testship.addPosition(new position(letters.A, 2));
    testship.addPosition(new position(letters.A, 3));

    var actual = gameController.isShipValid(testship);
    assert.ok(actual);
  });

  it('should return false if the ship is invalid', function () {
    var testship = new ship("Battleship", 3, 0);

    var actual = gameController.isShipValid(testship);
    assert.ok(!actual);
  });
});

describe('isSunkTests', function () {

  it('should return false if no positions have been hit', function () {
    const myShip = new ship("Destroyer", 3, "Yellow");
    myShip.addPosition({ column: "A", row: 1 });
    myShip.addPosition({ column: "A", row: 2 });
    myShip.addPosition({ column: "A", row: 3 });

    const result = myShip.isSunk();
    assert.strictEqual(result, false, "isSunk should return false if no positions are hit");
  });

  it('should return false if only some positions have been hit', function () {
    const myShip = new ship("Submarine", 3, "Green");
    myShip.addPosition({ column: "B", row: 1 });
    myShip.addPosition({ column: "B", row: 2 });
    myShip.addPosition({ column: "B", row: 3 });

    // Simulate a hit on one position
    myShip.checkHit({ column: "B", row: 1 });

    const result = myShip.isSunk();
    assert.strictEqual(result, false, "isSunk should return false if not all positions are hit");
  });

  it('should return true if all positions have been hit', function () {
    const myShip = new ship("Battleship", 4, "Red");
    myShip.addPosition({ column: "C", row: 1 });
    myShip.addPosition({ column: "C", row: 2 });
    myShip.addPosition({ column: "C", row: 3 });
    myShip.addPosition({ column: "C", row: 4 });

    // Simulate hits on all positions
    myShip.checkHit({ column: "C", row: 1 });
    myShip.checkHit({ column: "C", row: 2 });
    myShip.checkHit({ column: "C", row: 3 });
    myShip.checkHit({ column: "C", row: 4 });

    const result = myShip.isSunk();
    assert.strictEqual(result, true, "isSunk should return true if all positions are hit");
  });

  it('should return false for a ship with no positions', function () {
    const myShip = new ship("Patrol Boat", 2, "Blue");

    const result = myShip.isSunk();
    assert.strictEqual(result, false, "isSunk should return false for a ship with no positions");
  });
});