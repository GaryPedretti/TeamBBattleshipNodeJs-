class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
        this.positionsHit = [];
    }

    addPosition(position) {
        this.positions.push(position);
    }

    checkHit(position) {
        // Check if the position matches any in the ship's positions
        const isOnTarget = this.positions.some(
            (pos) => pos.column === position.column && pos.row === position.row
        );

        let isNewHit = false;

        if (isOnTarget) {
            // Check if it's already been hit
            const isAlreadyHit = this.positionsHit.some(
                (hit) => hit.column === position.column && hit.row === position.row
            );
            if (!isAlreadyHit) {
                this.positionsHit.push(position);
                isNewHit = true;
            }
        }

        return { isOnTarget, isNewHit };
    }
    
    isSunk() {
        return this.positions.length > 0 && this.positions.every(
            (pos) =>
                this.positionsHit.some(
                    (hit) => hit.column === pos.column && hit.row === pos.row
                )
        );
    }
}

module.exports = Ship;

