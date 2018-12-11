import {fileAsText} from '../common/files.js'

export default async function main() {
    hundredsDigit(12345).toBe(3);
    hundredsDigit(12).toBe(0);
    hundredsDigit(123).toBe(1);
    new Cell(3,5,8).level.toBe(4);
    new Cell(122,79,57).level.toBe(-5);
    new Cell(217,196,39).level.toBe(0);
    new Cell(101,153,71).level.toBe(4);
    const grid18solve = solve(18).cell;
    grid18solve.x.toBe(33);
    grid18solve.y.toBe(45);
    const grid42solve = solve(42).cell;
    grid42solve.x.toBe(21);
    grid42solve.y.toBe(61);
    return fileAsText('day11/input.txt').then(input => {
        const gridSize = parseInt(input);
        const {cell} = solve(gridSize);
        return `${cell.x},${cell.y}`.toBe("21,77");
    });
};

export function solve(gridSerial, dimension = 3) {
    // setup the grid
    const grid = createGrid(gridSerial);

    let highestTotal = 0;
    let highestCell = undefined;
    for(let x = 1; x <= 301 - dimension; x++) {
        for (let y = 1; y <= 301 - dimension; y++) {
            const total = totalLevelOfSubGrid(grid, x, y, dimension);
            if (total > highestTotal) {
                highestTotal = total;
                highestCell = grid[x][y];
            }
        }
    }
    return {cell: highestCell, total: highestTotal};
}

var grid_serial_cache = new Map();
function createGrid(serial) {
    let res;
    if(grid_serial_cache.has(serial)) {
        res = grid_serial_cache.get(serial);
    } else {
        res = [];
        for(let x = 1; x <= 300; x++) {
            for (let y = 1; y <= 300; y++) {
                if(!res[x]) { res[x] = []}
                res[x][y] = new Cell(x,y,serial);
            }
        }
        grid_serial_cache.set(serial, res);
    }
    return res;
}

function totalLevelOfSubGrid(grid, startX, startY, dimension) {
    let res = 0;
    for(let x = startX; x < startX + dimension; x++) {
        for (let y = startY; y < startY + dimension; y++) {
            res += grid[x][y].level;
        }
    }
    return res;
}

export class Cell {
    constructor(x,y, gridSerial) {
        this.gridSerial = gridSerial;
        this.x=x;
        this.y=y;
        // Find the fuel cell's rack ID, which is its X coordinate plus 10.
        this.rackID = this.x + 10;
        // Begin with a power level of the rack ID times the Y coordinate.
        this.level = this.rackID * this.y;
        // Increase the power level by the value of the grid serial number
        this.level += this.gridSerial;
        // Set the power level to itself multiplied by the rack ID.
        this.level *= this.rackID;
        // Keep only the hundreds digit of the power level
        this.level = hundredsDigit(this.level);
        // Subtract 5 from the power level
        this.level -= 5;
    }
}

function hundredsDigit(number) {
    let res = 0;
    const str = (number + '');
    if(str.length >= 3) {
        res = parseInt(str.substring(str.length - 3, str.length - 2));
    }
    return res;
}
