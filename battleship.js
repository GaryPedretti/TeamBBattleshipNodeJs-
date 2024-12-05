const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
let telemetryWorker;

class Battleship {

   static BOARD_LETTERS = [letters.A, letters.B, letters.C, letters.D, letters.E, letters.F, letters.H, letters.I];
    static BOARD_WIDTH = 8;

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
            Battleship.CheckFleetSunkenShips(this.enemyFleet);
            let position;
            while (true) {
                try {
                    position = Battleship.ParsePosition(readline.question("Enter coordinates for your shot: "));
                    break; // Exit the loop if parsing is successful
                } catch (error) {
                    console.log(cliColor.red(`Error: ${error.message}. Please try again.`));
                }
            }
            
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

                Battleship.DisplayPlayerShotResult(playerResult.isShotOnTarget);
                
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

                // // Check if any ship is sunk
                // this.myFleet.forEach(ship => {
                //     if (ship.isSunk()) {
                //         console.log(cliColor.redBright(`The computer sank your ${ship.name}!`));
                //     }
                // });
            }

            gameOver = gameController.checkIsGameOver(this.enemyFleet);
            if(gameOver) return "computer";

        }
        while (!gameOver);
    }

    static ParsePosition(input) {
        const rowInput = input.toUpperCase().substring(0, 1);
        const letter = letters.get(rowInput);
        const number = parseInt(input.substring(1), 10);
    
        if (!letter || !this.BOARD_LETTERS.includes(letter)) {
            throw new Error(`Invalid position: The row '${rowInput}' is outside the allowed board range.`);
        }
    
        if (isNaN(number) || number < 0 || number >= this.BOARD_WIDTH) {
            throw new Error(`Invalid position: The column '${number}' is outside the allowed board range.`);
        }
    
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
        this.InitializeMyFleetStatic();
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

    InitializeMyFleetStatic() {
        this.myFleet = gameController.InitializeShips();
        this.myFleet[0].addPosition(new position(letters.A, 1));
        this.myFleet[0].addPosition(new position(letters.A, 2));
        this.myFleet[0].addPosition(new position(letters.A, 3));

        this.myFleet[1].addPosition(new position(letters.B, 1));
        this.myFleet[1].addPosition(new position(letters.B, 2));
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

        this.enemyFleet[0].addPosition(new position(letters.D, 1));
        this.enemyFleet[0].addPosition(new position(letters.D, 2));
        this.enemyFleet[0].addPosition(new position(letters.D, 3));

        this.enemyFleet[1].addPosition(new position(letters.E, 1));
        this.enemyFleet[1].addPosition(new position(letters.E, 2));
    }

    static CheckFleetSunkenShips(fleet) {
        let sunkShips = [];
        fleet.forEach(ship => {
            if (ship.isSunk()) {
                sunkShips.push(ship.name);
            }
        });
        if (sunkShips.length > 0) {
            console.log(cliColor.redBright(`Ships sunk: ${sunkShips.join(', ')}.`));
        }
        return sunkShips;
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