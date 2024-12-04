class GameController {
    static InitializeShips() {
        var colors = require("cli-color");
        const Ship = require("./ship.js");
        var ships = [
            // new Ship("Aircraft Carrier", 5, colors.CadetBlue),
            // new Ship("Battleship", 4, colors.Red),
            // new Ship("Submarine", 3, colors.Chartreuse),
            // new Ship("Destroyer", 3, colors.Yellow),
            new Ship("Patrol Boat", 2, colors.Orange)
        ];
        return ships;
    }

    static CheckIsHit(ships, shot) {
        if (shot === undefined) {
            throw new Error("The shooting position is not defined");
        }
        if (ships === undefined || !Array.isArray(ships) || ships.length === 0) {
            throw new Error("No ships defined");
        }
    
        let isShotOnTarget = false;
        let isNewHit = false;
    
        // Iterate through all ships to check the shot
        ships.forEach(function (ship) {
            const hitResult = ship.checkHit(shot);
            if (hitResult.isOnTarget) {
                isShotOnTarget = true;
                if (hitResult.isNewHit) {
                    isNewHit = true;
    
                    // Check if the ship is now sunk
                    if (ship.isSunk()) {
                        console.log(`Ship sunk: ${ship.name}`);
                    }
                }
            }
        });
    
        return { isShotOnTarget, isNewHit };
    }
    

    static isShipValid(ship) {
        return ship.positions.length == ship.size;
    }

    static checkIsGameOver(ships) {

        let rtn = true;

        ships.forEach(function (ship) {
            if(!ship.isSunk()) { rtn = false;}
        });

        return rtn;

    }
}

module.exports = GameController;