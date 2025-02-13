const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
const tabchars = "                              ";
let telemetryWorker;

class Battleship {
    start() {
        telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");   

        console.log(cliColor.green("Starting..."));
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
        console.log("                  __");
        console.log("                 /  \\");
        console.log("           .-.  |    |");
        console.log("   *    _.-'  \\  \\__/");
        console.log("    \\.-'       \\");
        console.log("   /          _/");
        console.log("  |      _  /");
        console.log("  |     /_\\'");
        console.log("   \\    \\_/");
        console.log("    \"\"\"\"");

        var finishGame = false;
        do {

            console.log();
            console.log(cliColor.green("Player, it's your turn"));
            console.log(cliColor.green("Enter coordinates for your shot :"));
            var position = Battleship.ParsePosition(readline.question());
            var isHit = gameController.CheckIsHit(this.enemyFleet, position);

            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: isHit}});

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
            else{
                   console.log(cliColor.blue("    ,(   ,(   ,(   ,(   ,(   ,(   ,(   ,("));
                   console.log(cliColor.blue("`-'  `-'  `-'  `-'  `-'  `-'  `-'  `-'  `"));

            }

            
            console.log(isHit ? cliColor.red("Yeah ! Nice hit !") : cliColor.blue( "Miss"));
            
            ///Display Computers Sunk and Left
            var enemySunkShips = gameController.getSunkShipNames(this.enemyFleet);
            var enemyLeftShips = gameController.getLeftShipNames(this.enemyFleet);
            
            if(enemyLeftShips == ""  )
            {
                finishGame = true;
                console.log(cliColor.green("YOU ARE THE WINNER!"));
            }
            else{
                console.log(cliColor.red("Enemy's ships Sunk: " + (enemySunkShips == "" ? " none" : enemySunkShips ) ));
                console.log(cliColor.blue("Enemy's ships Left: "+ (enemyLeftShips == "" ? " none" : enemyLeftShips ) ));
            }
           

            
            //Computer's Turn 
            var computerPos = this.GetRandomPosition();
            var isHit = gameController.CheckIsHit(this.myFleet, computerPos);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: isHit}});

            console.log();

            
            
            if (isHit) {
                console.log(cliColor.red(tabchars + `Computer shot in ${computerPos.column}${computerPos.row} and has hit your ship ! `));
                beep();

                console.log(cliColor.red(tabchars + "                \\         .  ./"));
                console.log(cliColor.red(tabchars + "              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red(tabchars + "                  (M^^.^~~:.'\")."));
                console.log(cliColor.red(tabchars + "            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red(tabchars + "               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red(tabchars + "            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red(tabchars + "                 -\\  \\     /  /-"));
                console.log(cliColor.red(tabchars + "                   \\  \\   /  /"));
            }
            else{
                console.log(cliColor.blue(tabchars + `Computer shot in ${computerPos.column}${computerPos.row} and has miss` ));
                console.log(cliColor.blue(tabchars + "    ,(   ,(   ,(   ,(   ,(   ,(   ,(   ,("));
                console.log(cliColor.blue(tabchars + "`-'  `-'  `-'  `-'  `-'  `-'  `-'  `-'  `"));

         }
         
         var playerSunkShips = gameController.getSunkShipNames(this.myFleet);
         var playerLeftShips = gameController.getLeftShipNames(this.myFleet);

         if(playerLeftShips == ""  )
            {
                finishGame = true;
                console.log(cliColor.red("YOU LOST!"));
            }
            else{

                //Display my Sunk and Left Ships
                console.log(cliColor.red("Player's ships Sunk: " + (playerSunkShips == "" ? " none" : playerSunkShips ) ));
                console.log(cliColor.blue("Player's ships Left: "+ (playerLeftShips == "" ? " none" : playerLeftShips ) ));
            }
        }
        while (!finishGame);
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
        //this.InitializePlayerFleet();
        this.InitializeEnemyFleet();
    }

    InitializePlayerFleet() {
        this.myFleet = gameController.InitializeShips();
         this.myFleet[0].addPosition(new position(letters.A, 1));
         this.myFleet[0].addPosition(new position(letters.A, 2));
         this.myFleet[0].addPosition(new position(letters.A, 3));
         this.myFleet[0].addPosition(new position(letters.A, 4));
         this.myFleet[0].addPosition(new position(letters.A, 5));
         this.myFleet[1].addPosition(new position(letters.B, 1));
         this.myFleet[1].addPosition(new position(letters.B, 2));
         this.myFleet[1].addPosition(new position(letters.B, 3));
         this.myFleet[1].addPosition(new position(letters.B, 4));
         this.myFleet[2].addPosition(new position(letters.C, 1));
         this.myFleet[2].addPosition(new position(letters.C, 2));
         this.myFleet[2].addPosition(new position(letters.C, 3));
         this.myFleet[3].addPosition(new position(letters.D, 1));
         this.myFleet[3].addPosition(new position(letters.D, 2));
         this.myFleet[3].addPosition(new position(letters.D, 3));
         this.myFleet[4].addPosition(new position(letters.E, 1));
         this.myFleet[4].addPosition(new position(letters.E, 2));
        
    }

    InitializeMyFleet() {
        this.myFleet = gameController.InitializeShips();

        console.log(cliColor.green("Quick start are manually set fleet"));

        console.log(cliColor.green("Please position your fleet (Game board size is from A to H and 1 to 8) :"));
        if(readline.question() == "quick"  ){
            this.InitializePlayerFleet();
        }
        else{
            this.myFleet.forEach(function (ship) {
                console.log();
                console.log(cliColor.green(`Please enter the positions for the ${ship.name} (size: ${ship.size})`));
                for (var i = 1; i < ship.size + 1; i++) {
                        console.log(cliColor.green(`Enter position ${i} of ${ship.size} (i.e A3):`));
                        const position = readline.question();
                        telemetryWorker.postMessage({eventName: 'Player_PlaceShipPosition', properties:  {Position: position, Ship: ship.name, PositionInShip: i}});
                        ship.addPosition(Battleship.ParsePosition(position));
                }
            })
        }

        
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
}

module.exports = Battleship;