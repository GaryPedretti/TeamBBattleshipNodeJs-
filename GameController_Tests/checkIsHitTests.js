const assert = require('assert').strict;
const cliColor = require('cli-color');
const { CheckFleetSunkenShips } = require("../battleship.js");
const gameController = require("../GameController/gameController.js");
const letters = require("../GameController/letters.js");
const position = require("../GameController/position.js");

describe('CheckFleetSunkenShipsTests', function () {

  it('should return one sunken ship when one ship in the fleet is sunk', function () {
    var ships = gameController.InitializeShips();

    // Set up a single ship and mark it as sunk
    ships[0].addPosition(new position(letters.A, 1));
    ships[0].addPosition(new position(letters.A, 2));
    ships[0].addPosition(new position(letters.A, 3));

    ships[0].checkHit(new position(letters.A, 1))
    ships[0].checkHit(new position(letters.A, 2));
    ships[0].checkHit(new position(letters.A, 3));

    const result = CheckFleetSunkenShips(ships);

    assert.deepStrictEqual(result, [ships[0].name], "The function did not correctly identify the sunk ship");
  });

});

describe('ParsePositionTests', function () {

  it('should parse a valid position correctly', function () {
    const result = Battleship.ParsePosition("A1");
    assert.strictEqual(result.column, letters.A, "The row letter was parsed incorrectly");
    assert.strictEqual(result.row, 1, "The column number was parsed incorrectly");
  });

  it('should throw an error for an invalid row letter', function () {
    assert.throws(
      () => Battleship.ParsePosition("Z1"),
      /Invalid position: The row 'Z' is outside the allowed board range/,
      "Did not throw the correct error for an invalid row"
    );
  });

  it('should throw an error for an invalid column number', function () {
    assert.throws(
      () => Battleship.ParsePosition("A9"),
      /Invalid position: The column '9' is outside the allowed board range/,
      "Did not throw the correct error for an invalid column"
    );
  });

  it('should throw an error for a negative column number', function () {
    assert.throws(
      () => Battleship.ParsePosition("A-1"),
      /Invalid position: The column '-1' is outside the allowed board range/,
      "Did not throw the correct error for a negative column"
    );
  });

  it('should throw an error for a non-numeric column number', function () {
    assert.throws(
      () => Battleship.ParsePosition("Aabc"),
      /Invalid position: The column 'NaN' is outside the allowed board range/,
      "Did not throw the correct error for a non-numeric column"
    );
  });

});
