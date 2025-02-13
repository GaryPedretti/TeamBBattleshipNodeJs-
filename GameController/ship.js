class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
        this.hitPositions = [] ;

    }

    addPosition(position) {
        this.positions.push(position);
    }

    addHit(position) {
        this.hitPositions.push(position);
    }
}

module.exports = Ship;