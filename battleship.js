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

        Battleship.DisplayGeneralMessage("Starting...");
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
        this.StartGame();
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

        do {
            console.log();
            Battleship.DisplayGeneralMessage("Player, it's your turn");
            Battleship.DisplayGeneralMessage("Enter coordinates for your shot :");
            var position = Battleship.ParsePosition(readline.question());
            var isHit = gameController.CheckIsHit(this.enemyFleet, position);

            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: isHit}});

            if (isHit) {
                beep();

                console.log(cliColor.yellow("                \\         .  ./"));
                console.log(cliColor.yellow("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.yellow("                  (M^^.^~~:.'\")."));
                console.log(cliColor.yellow("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.yellow("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.yellow("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.yellow("                 -\\  \\     /  /-"));
                console.log(cliColor.yellow("                   \\  \\   /  /"));
            }

            Battleship.DisplayPlayerShotResult(isHit);

            var computerPos = this.GetRandomPosition();
            var isHit = gameController.CheckIsHit(this.myFleet, computerPos);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: isHit}});

            console.log();
            Battleship.DisplayComputerShotResult(isHit, computerPos)
            if (isHit) {
                beep();

                console.log(cliColor.red("                \\         .  ./"));
                console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red("                  (M^^.^~~:.'\")."));
                console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red("                 -\\  \\     /  /-"));
                console.log(cliColor.red("                   \\  \\   /  /"));
            }
        }
        while (true);
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
        this.InitializeMyFleet();
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

    InitializeEnemyFleet() {
        this.enemyFleet = gameController.InitializeShips();

        this.enemyFleet[0].addPosition(new position(letters.B, 4));
        this.enemyFleet[0].addPosition(new position(letters.B, 5));
        this.enemyFleet[0].addPosition(new position(letters.B, 6));
        this.enemyFleet[0].addPosition(new position(letters.B, 7));
        this.enemyFleet[0].addPosition(new position(letters.B, 8));

        this.enemyFleet[1].addPosition(new position(letters.E, 6));
        this.enemyFleet[1].addPosition(new position(letters.E, 7));
        this.enemyFleet[1].addPosition(new position(letters.E, 8));
        this.enemyFleet[1].addPosition(new position(letters.E, 9));

        this.enemyFleet[2].addPosition(new position(letters.A, 3));
        this.enemyFleet[2].addPosition(new position(letters.B, 3));
        this.enemyFleet[2].addPosition(new position(letters.C, 3));

        this.enemyFleet[3].addPosition(new position(letters.F, 8));
        this.enemyFleet[3].addPosition(new position(letters.G, 8));
        this.enemyFleet[3].addPosition(new position(letters.H, 8));

        this.enemyFleet[4].addPosition(new position(letters.C, 5));
        this.enemyFleet[4].addPosition(new position(letters.C, 6));
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