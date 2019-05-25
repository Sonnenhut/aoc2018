import {fileAsText} from '../common/files.js'

export const EXAMPLE = `x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`;


export default async function main() {
    //Coordinate.parse("x=1, y=2")[0].eq(new Coordinate(1,2)).toBe(true);
    Coordinate.parse("x=1, y=2..4")[0].eq(new Coordinate(1,2)).toBe(true);
    Coordinate.parse("x=1, y=2..4")[1].eq(new Coordinate(1,3)).toBe(true);
    Coordinate.parse("x=1, y=2..4")[2].eq(new Coordinate(1,4)).toBe(true);
    Coordinate.parse("y=1, x=2..4")[0].eq(new Coordinate(2,1)).toBe(true);
    Coordinate.parse("y=1, x=2..4")[1].eq(new Coordinate(3,1)).toBe(true);
    Coordinate.parse("y=1, x=2..4")[2].eq(new Coordinate(4,1)).toBe(true);

    let world = new World();
    world.put(0,10, '#');
    world.put(1,9, '#');
    world.put(1,12, '#');
    world.put(4,15, '#');
    world.initBoundaries();
    world.maxY.toBe(15);

    world = parseScan(EXAMPLE);
    world.initBoundaries();
    world.get(495,1).toBe('.');
    world.get(495,2).toBe('#');
    world.get(495,3).toBe('#');
    world.get(495,4).toBe('#');
    world.get(495,5).toBe('#');
    world.get(495,6).toBe('#');
    world.get(495,7).toBe('#');
    world.get(495,8).toBe('.');
    world.get(503,13).toBe('#');
    world.isAtEnd(499,4, -1).toBe(true);
    world.isAtEnd(500,4, +1).toBe(true);

    world.dropToNextBucket(500,0).toBe([500,6]);
    world.get(500,1).toBe('|');
    world.get(500,2).toBe('|');
    world.get(500,3).toBe('|');
    world.get(500,4).toBe('|');
    world.get(500,5).toBe('|');
    world.get(500,6).toBe('|');
    world.get(500,7).toBe('#');

    world.fillRow(500,6).toBe([]);
    world.get(500,6).toBe('~');
    world.get(499,6).toBe('~');
    world.get(498,6).toBe('~');
    world.get(497,6).toBe('~');
    world.get(496,6).toBe('~');

    world.fillRow(500,5).toBe([]);
    world.fillRow(500,4).toBe([]);
    world.get(500,4).toBe('~');
    world.get(499,4).toBe('~');
    world.get(498,4).toBe('#');
    world.get(497,4).toBe('.');
    world.fillRow(500,3).toBe([]);
    world.get(500,3).toBe('~');
    world.get(499,3).toBe('~');
    world.fillRow(500,2).toBe([[502,2]]);
    world.get(502,2).toBe('|');
    world.get(500,2).toBe('|');
    world.get(499,2).toBe('|');
    world.get(498,2).toBe('#');
    world.get(497,2).toBe('.');
    world.get(596,2).toBe('.');
    world.dropToNextBucket(502,2).toBe([502,12]);
    world.dropToNextBucket(507,9).toBe([]);

    //fill other bucket
    world.fillRow(502,12).toBe([]);
    world.fillRow(502,11).toBe([]);
    world.fillRow(502,10).toBe([]);
    world.fillRow(502,9).toBe([[497,9],[505,9]]);

    // fill buckets directly
    world = parseScan(EXAMPLE);
    world.initBoundaries();
    world.fillBucket(500,6).toBe([[502,2]]);
    world.get(496,6).toBe('~');
    world.get(499,2).toBe('|');
    world.get(498,2).toBe('#');
    world.get(497,2).toBe('.');
    world.get(596,2).toBe('.');
    world.fillBucket(502,12).toBe([[497,9],[505,9]]);
    world.get(500,12).toBe('~');
    world.get(497,9).toBe('|');
    world.get(505,9).toBe('|');
    world.get(500,12).toBe('~');

    world = parseScan(EXAMPLE);
    world.initBoundaries();
    world.pour(500,1);
    world.countWater().toBe(57);

    return fileAsText('day17/input.txt').then(input => {
        world = parseScan(input);
        world.initBoundaries();
        world.pour(500,1);
        let res = world.countWater();
        res.notToBe(70816); // too high
        res.notToBe(38453); // too high
        res.notToBe(38452); // too high
        res.toBe(38451);
        return res;
    });
};


export function parseScan(input) {
    const scan = new World();
    input.split(/\r?\n|\n/g)
        .flatMap(line => Coordinate.parse(line))
        .forEach(coord => scan.put(coord.x,coord.y, '#'));
    return scan;
}

class Water {
    constructor(world) {
        this.world = world;
        this.x = 500;
        this.y = 0;
        this.world.put(this.x,this.y,'+');
    }
    next() {
        this.world.put(this.x,this.y,'|');
    }
}

class World{
    constructor(){
        this.w = [];
    }
    initBoundaries() {
        this.maxY = this.w.reduce((maxY, col) => {
            const colsMax = col.reduce((candidate, val, yIdx) => {
                return Math.max(candidate, yIdx);
            }, 0);
            return Math.max(colsMax, maxY);
        }, 0);
    }
    put(x,y,val) {
        if(this.w[x] === undefined) {
            this.w[x] = [];
        }
        this.w[x][y] = val;
    }
    get(x,y) {
        if(this.w[x] === undefined) {
            this.w[x] = [];
        }
        return this.w[x][y] ? this.w[x][y] : '.' ;
    }

    countWater(toCount = ['~','|']) {
        // calculate the first row to count (includes a wall)
        let boundaryY = -1;
        let boundaryReached = false;
        do {
            boundaryY++;
            for(let x = 0; x < this.w.length; x++) {
                let cur = (this.w[x] || [])[boundaryY];
                boundaryReached = cur && cur === '#';
                if (boundaryReached) {
                    break;
                }
            }
        } while(!boundaryReached);

        // count settled and unsettled water
        return this.w.reduce((acc, col) => {
            const colWaterCnt = col.reduce((accY, val, yIdx) => {
                let cnt = (toCount.includes(val) ? 1 : 0);
                return yIdx >= boundaryY ? accY + cnt : accY;
            }, 0);
            return colWaterCnt + acc;
        }, 0);
    }

    pour(x,y) {
        let drops = [[x,y]];
        do {
            let buckets = drops.reduce((acc, drop) =>  {
                const nextBucket = this.dropToNextBucket(drop[0], drop[1]);
                if(nextBucket.length > 0) {
                    acc.push(nextBucket);
                }
                return acc;
            },[]);
            drops = buckets.reduce((acc, bucket) =>  {
                acc.push(...this.fillBucket(bucket[0], bucket[1]));
                return acc;
            },[]);
            drops = deduplicate(drops);
        } while(drops.length > 0);
    }

    dropToNextBucket(x, y) {
        let res = [];
        do {
            let pointer = this.get(x,y);
            if(pointer === '#') {
                res = [x,y - 1];
                break;
            } else {
                this.put(x,y,'|');
            }
            y++;
        } while (y <= this.maxY);
        return res;
    }
    fillBucket(x, y) {
        // row per row
        let drops = [];
        do {
            drops = this.fillRow(x,y);
            y--;
        } while(drops.length === 0);
        return drops;
    }

    fillRow(x,y) {
        let drops = [];
        let fill = '~';
        // left
        let leftEnd = x;
        let atEnd = false, atDrop = false;
        do {
            atEnd = this.isAtEnd(leftEnd,y, -1);
            atDrop = this.isAtDrop(leftEnd,y);
            leftEnd--; // left
        } while (!atEnd && !atDrop);
        leftEnd++;
        if(atDrop) {
            fill = '|';
            drops.push([leftEnd, y]);
        }

        // right
        let rightEnd = x;
        atEnd = false;
        atDrop = false;
        do {
            atEnd = this.isAtEnd(rightEnd,y, + 1);
            atDrop = this.isAtDrop(rightEnd,y);
            rightEnd++; // right
        } while (!atEnd && !atDrop);
        rightEnd--;
        if(atDrop) {
            fill = '|';
            drops.push([rightEnd, y]);
        }
        for(let i = leftEnd; i <= rightEnd; i++) {
            this.put(i,y,fill);
        }
        return drops; // returns drops in this row (if any)
    }

    isAtEnd(x,y, direction) {
        let side = this.get(x + direction, y) === '#';
        return side;
    }
    isAtDrop(x,y) {
        let cur = this.get(x, y + 1);
        return cur === '.' || cur === '|';
    }
}

class Coordinate {
    static parse(str) {
        let res = [];
        let parts = str.split(", ");
        let x,y;
        for(let part of parts) {
            if(part.startsWith('x')) {
                x = part.split('x=')[1];
            } else {
                y = part.split('y=')[1];
            }
        }
        // handle ranges
        parseRange(x).forEach( oneX => {
            parseRange(y).forEach(oneY => {
                res.push(new Coordinate(oneX, oneY));
            })
        });
        return res;
    }
    constructor(x,y) {
        this.x=x;
        this.y=y;
    }
    eq(other){
        return this.x === other.x && this.y === other.y;
    }
}

function deduplicate(arr) {
    let map = new Map();
    arr.forEach(item => map.set(JSON.stringify(item), item));
    return [... map.values()];
}

function parseRange(str) {
    let res = [];
    if(str.indexOf('..') !== -1) {
        // spread
        let [from, to] = str.split('..').map(it => parseInt(it));
        for(from;from <=to; from++) {
            res.push(from);
        }
    } else {
        res.push(parseInt(str));
    }
    return res;
}