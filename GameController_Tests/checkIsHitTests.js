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
