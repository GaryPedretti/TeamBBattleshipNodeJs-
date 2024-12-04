class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
    }

    addPosition(position) {
        this.positions.push(position);
    }

    isSunk() {

        var rtn = true;

        for (var i=0; i<this.positions.length; i++) {
            if(!this.positions[i].isHit) {
                rtn = false;
            }
        }

        return rtn;
    }
}

module.exports = Ship;