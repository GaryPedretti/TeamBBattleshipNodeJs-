class Position {
    constructor(column, row) {
        this.column = column;
        this.row = row;
        this.isHit = false;
    }

    hit() {
        this.isHit = true;
    }

    unhit() {
        this.isHit = false;
    }

    toString() {
        return this.column.toString() + this.row.toString()
    }

}

module.exports = Position;