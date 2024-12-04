const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
let telemetryWorker;

class Battleship {
    start() {
        telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");
        console.clear();
        console.log("Starting new game...");
        telemetryWorker.postMessage({eventName: 'ApplicationStarted', properties:  {Technology: 'Node.js'}});

        console.log(cliColor.magenta("                                     |__"));
        console.log(cliColor.magenta("                                     |\\/"));
        console.log(cliColor.magenta("                                     ---"));
        console.log(cliColor.magenta("                                     / | ["));
        console.log(cliColor.magenta("                              !      | |||"));
        console.log(cliColor.magenta("                            _/|     _/|-++'"));
        console.log(cliColor.magenta("                        +  +--|    |--|--|_ |-"));
        console.log(cliColor.magenta("                     { /|__|  |/\\__|  |--- |||__/"));
        console.log(cliColor.magenta("                    +---------------___[}-_===_.'____                 /\\"));
        console.log(cliColor.magenta("                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _"));
        console.log(cliColor.magenta(" __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7"));
        console.log(cliColor.magenta("|                        Welcome to Battleship                         BB-61/"));
        console.log(cliColor.magenta(" \\_________________________________________________________________________|"));
        console.log();

        this.InitializeGame();

        let gameWinner = this.StartGame();

        if(gameWinner == "player") {
            console.clear();
            console.log("You win!!!");
        }

        if(gameWinner == "computer")
        {
            console.clear();
            console.log("Sorry, you lose.");
        }

        var restart = '';
        do
        {
            console.log("Would you like to play again? Y/N");
            restart = readline.question();
            restart = restart.toUpperCase();
        } while (restart != "Y" && restart != "YES" && restart != "N" && restart != "NO")

        let rtn = false;
        if (restart == "Y" || restart == "YES") rtn = true;
        return rtn;
        
    }

    StartGame() {
        console.clear();

        console.log(cliColor.magenta("                  __"));
        console.log(cliColor.magenta("                 /  \\"));
        console.log(cliColor.magenta("           .-.  |    |"));
        console.log(cliColor.magenta("   *    _.-'  \\  \\__/"));
        console.log(cliColor.magenta("    \\.-'       \\"));
        console.log(cliColor.magenta("   /          _/"));
        console.log(cliColor.magenta("  |      _  /"));
        console.log(cliColor.magenta("  |     /_\\'"));
        console.log(cliColor.magenta("   \\    \\_/"));
        console.log(cliColor.magenta("    \"\"\"\""));

        let gameOver = false;

        do {
            console.log();
            Battleship.DisplayGeneralMessage("Player, it's your turn");
            Battleship.DisplayGeneralMessage("Enter coordinates for your shot :");
            var position = Battleship.ParsePosition(readline.question());
            const playerResult = gameController.CheckIsHit(this.enemyFleet, position);

            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: playerResult.isShotOnTarget}});

            if (playerResult.isShotOnTarget && playerResult.isNewHit) {
                beep();

                console.log(cliColor.yellow("                \\         .  ./"));
                console.log(cliColor.yellow("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.yellow("                  (M^^.^~~:.'\")."));
                console.log(cliColor.yellow("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.yellow("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.yellow("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.yellow("                 -\\  \\     /  /-"));
                console.log(cliColor.yellow("                   \\  \\   /  /"));

                // Check if any ship is sunk
                this.enemyFleet.forEach(ship => {
                    if (ship.isSunk()) {
                        console.log(cliColor.redBright(`You sank the enemy's ${ship.name}!`));
                    }
                });
            } else if (playerResult.isShotOnTarget && !playerResult.isNewHit){
                console.log(cliColor.red("You have already shot this position!"))
            } else {
                Battleship.DisplayPlayerShotResult(playerResult.isShotOnTarget);
            }

            gameOver = gameController.checkIsGameOver(this.enemyFleet);
            if(gameOver) return "player";

            var computerPos = this.GetRandomPosition();
            var computerResult = gameController.CheckIsHit(this.myFleet, computerPos);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: computerResult.isShotOnTarget}});

            console.log();
            Battleship.DisplayComputerShotResult(computerResult.isShotOnTarget, computerPos)
            if (computerResult.isShotOnTarget) {
                beep();

                console.log(cliColor.red("                \\         .  ./"));
                console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red("                  (M^^.^~~:.'\")."));
                console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red("                 -\\  \\     /  /-"));
                console.log(cliColor.red("                   \\  \\   /  /"));

                // Check if any ship is sunk
                this.myFleet.forEach(ship => {
                    if (ship.isSunk()) {
                        console.log(cliColor.redBright(`The computer sank your ${ship.name}!`));
                    }
                });
            }

            gameOver = gameController.checkIsGameOver(this.enemyFleet);
            if(gameOver) return "computer";

        }
        while (!gameOver);
    }
    

    static ParsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        var number = parseInt(input.substring(1, 2), 10);
        return new position(letter, number);
    }

    GetRandomPosition() {
        var rows = 8;
        var lines = 8;
        var rndColumn = Math.floor((Math.random() * lines));
        var letter = letters.get(rndColumn + 1);
        var number = Math.floor((Math.random() * rows));
        var result = new position(letter, number);
        return result;
    }

    InitializeGame() {
        // this.InitializeMyFleet();
        this.InitializeMyFleetEmpty();
        this.InitializeEnemyFleet();
    }

    InitializeMyFleet() {
        this.myFleet = gameController.InitializeShips();

        Battleship.DisplayGeneralMessage("Please position your fleet (Game board size is from A to H and 1 to 8) :");

        this.myFleet.forEach(function (ship) {
            console.log();
            Battleship.DisplayGeneralMessage(`Please enter the positions for the ${ship.name} (size: ${ship.size})`);
            for (var i = 1; i < ship.size + 1; i++) {
                Battleship.DisplayGeneralMessage(`Enter position ${i} of ${ship.size} (i.e A3):`);
                    const position = readline.question();
                    telemetryWorker.postMessage({eventName: 'Player_PlaceShipPosition', properties:  {Position: position, Ship: ship.name, PositionInShip: i}});
                    ship.addPosition(Battleship.ParsePosition(position));
            }
        })
    }

    InitializeMyFleetEmpty() {
        this.myFleet = gameController.InitializeShips();
        const usedPositions = new Set();
    }
    

    InitializeEnemyFleet() {
        this.enemyFleet = gameController.InitializeShips();

        // this.enemyFleet[0].addPosition(new position(letters.A, 1));
        // this.enemyFleet[0].addPosition(new position(letters.A, 2));
        // this.enemyFleet[0].addPosition(new position(letters.A, 3));
        // this.enemyFleet[0].addPosition(new position(letters.A, 4));
        // this.enemyFleet[0].addPosition(new position(letters.A, 5));

        // this.enemyFleet[1].addPosition(new position(letters.B, 1));
        // this.enemyFleet[1].addPosition(new position(letters.B, 2));
        // this.enemyFleet[1].addPosition(new position(letters.B, 3));
        // this.enemyFleet[1].addPosition(new position(letters.B, 4));

        // this.enemyFleet[2].addPosition(new position(letters.C, 1));
        // this.enemyFleet[2].addPosition(new position(letters.C, 2));
        // this.enemyFleet[2].addPosition(new position(letters.C, 3));

        // this.enemyFleet[3].addPosition(new position(letters.D, 1));
        // this.enemyFleet[3].addPosition(new position(letters.D, 2));
        // this.enemyFleet[3].addPosition(new position(letters.D, 3));

        // this.enemyFleet[4].addPosition(new position(letters.E, 1));
        // this.enemyFleet[4].addPosition(new position(letters.E, 2));

        // delete
        this.enemyFleet[0].addPosition(new position(letters.E, 1));
        this.enemyFleet[0].addPosition(new position(letters.E, 2));
    }

    static DisplayGeneralMessage(text){
        console.log(cliColor.green(text))
    }

    static DisplayPlayerShotResult(isHit){
        if(isHit){
            console.log(cliColor.yellow("Yeah! Nice hit!"))
        }
        else{
            console.log(cliColor.blue("Miss"))
        }
    }

    static DisplayComputerShotResult(isHit, computerPos){
        if(isHit){
            console.log(cliColor.red(`Computer shot in ${computerPos.column}${computerPos.row} and has hit your ship !`));
        }
        else{
            console.log(cliColor.blue(`Computer shot in ${computerPos.column}${computerPos.row} and missed`))
        }
    }

}

module.exports = Battleship;