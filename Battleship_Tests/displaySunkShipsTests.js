const assert=require('assert').strict;
const ship=require("../GameController/ship.js");
const battleship=require("../battleship.js");
const letters=require("../GameController/letters.js");
const position=require("../GameController/position.js")
const gameController=require("../GameController/gameController.js")

describe('displayIfShipIsSunkTests', function() {
  it('should return if ship is completely sunk', function() {
    var colors = require("cli-color");
    var shipOne = new ship("Aircraft Carrier", 5, colors.CadetBlue);
    shipOne.addHit(letters.A, 1);
    shipOne.addHit(letters.A, 2);
    shipOne.addHit(letters.A, 3);
    shipOne.addHit(letters.A, 4);
    shipOne.addHit(letters.A, 5);

    var expected = shipOne.size;
    var actual = shipOne.hitPositions.length;
    assert.deepStrictEqual(actual, expected);
  });
});

describe('displayShipsLeft', function() {
  it('should return ships left', function() {
    var colors = require("cli-color");
    var ships = gameController.InitializeShips();
    ships[0].addHit(letters.A, 1);
    ships[0].addHit(letters.A, 2);
    ships[0].addHit(letters.A, 3);
    ships[0].addHit(letters.A, 4);
    ships[0].addHit(letters.A, 5);
    ships[4].addHit(letters.B, 1);
    ships[4].addHit(letters.B, 2);

    var expected = 2;
    var actual = 0;
    for (let index = 0; index < ships.length; index++) {
      const element = ships[index];
      if(element.size == element.hitPositions.length){
        actual++;
      }
    }

    assert.deepStrictEqual(actual, expected);
  });
});

describe('displayNamesofShipsSunk', function() {
  it('should return ships sunk', function() {
    var colors = require("cli-color");
    var ships = gameController.InitializeShips();
    ships[0].addHit(letters.A, 1);
    ships[0].addHit(letters.A, 2);
    ships[0].addHit(letters.A, 3);
    ships[0].addHit(letters.A, 4);
    ships[0].addHit(letters.A, 5);
    ships[4].addHit(letters.B, 1);
    ships[4].addHit(letters.B, 2);

    var expected = "Aircraft Carrier" + "Patrol Boat";
    var actual = gameController.getSunkShipNames(ships);
    

    assert.deepStrictEqual(actual, expected);
  });
});

