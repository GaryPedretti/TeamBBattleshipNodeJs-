const battleship = require("./battleship.js");

let keepPlaying = new battleship().start();

while(keepPlaying) {
    let keepPlaying = new battleship().start();
}