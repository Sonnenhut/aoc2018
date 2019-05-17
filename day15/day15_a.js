import {fileAsText} from '../common/files.js'

//TODO finish day 15


const EXAMPLE_0_DAY =   "#######\n" +
                        "#E..G.#\n" +
                        "#...#.#\n" +
                        "#.G.#G#\n" +
                        "#######";

const EXAMPLE_1_DAY =   "#######\n" +
                        "#.E...#\n" +
                        "#.....#\n" +
                        "#...G.#\n" +
                        "#######";

const EXAMPLE_2_DAY =   "#########\n" +
                        "#G..G..G#\n" +
                        "#.......#\n" +
                        "#.......#\n" +
                        "#G..E..G#\n" +
                        "#.......#\n" +
                        "#.......#\n" +
                        "#G..G..G#\n" +
                        "#########";

export default async function main() {
    /*
    new Unit('G').isEnemy(new Unit('E')).toBe(true);
    new Unit('E').isEnemy(new Unit('G')).toBe(true);

    pos(1,1).isAdjacent(pos(0,1)).toBe(true);
    pos(1,1).isAdjacent(pos(2,1)).toBe(true);
    pos(1,1).isAdjacent(pos(1,0)).toBe(true);
    pos(1,1).isAdjacent(pos(1,2)).toBe(true);

    [pos(1,1), pos(1,0)].first().x.toBe(0);
    [pos(1,1), pos(0,1)].first().y.toBe(0);

    const example0 = parse(EXAMPLE_0_DAY);
    let elf = example0.filter(unit => unit.pos.eq(pos(1,1)))[0];
    elf.isElf().toBe(true);
    elf.targets(example0).first().pos.eq(pos(1,4)).toBe(true);
    const inRange = elf.inRangeUnits(elf.targets(example0), example0).sorted();
    inRange.length.toBe(6);
    inRange[0].pos.eq(pos(1,3)).toBe(true);
    inRange[1].pos.eq(pos(1,5)).toBe(true);
    inRange[2].pos.eq(pos(2,2)).toBe(true);
    inRange[3].pos.eq(pos(2,5)).toBe(true);
    inRange[4].pos.eq(pos(3,1)).toBe(true);
    inRange[5].pos.eq(pos(3,3)).toBe(true);

    elf.isReachable(inRange[0], example0).toBe(true);
    const reachable = inRange.filter(other => elf.isReachable(other, example0)).sorted();
    reachable.length.toBe(4);
    reachable[0].pos.eq(pos(1,3)).toBe(true);
    reachable[1].pos.eq(pos(2,2)).toBe(true);
    reachable[2].pos.eq(pos(3,1)).toBe(true);
    reachable[3].pos.eq(pos(3,3)).toBe(true);

    elf.path(reachable[0], example0).length.toBe(2);
    elf.path(reachable[1], example0).length.toBe(2);
    elf.path(reachable[2], example0).length.toBe(2);
    elf.path(reachable[3], example0).length.toBe(4);
    elf.path(reachable[3], example0).length.toBe(4);
    elf.path(inRange[1], example0).length.toBe(0); // behind a wall, no path

    */
    let elf;

    const example1 = parse(EXAMPLE_1_DAY);
    elf = example1.filter(unit => unit.isElf()).first();
    elf.nextStep(example1);
    elf.pos.eq(pos(1,3)).toBe(true);
    elf.nextStep(example1);
    elf.pos.eq(pos(1,4)).toBe(true);
    elf.nextStep(example1);
    elf.pos.eq(pos(2,4)).toBe(true);
    // no more step, is already adjacent
    elf.nextStep(example1);
    elf.pos.eq(pos(2,4)).toBe(true);

    const example2 = parse(EXAMPLE_2_DAY);
    let movingUnits = example2.filter(unit => unit.isElf() || unit.isGoblin());
    elf = example2.filter(unit => unit.isElf()).first();

    const checkGoblins = (positions) => {
        return positions.map(pos => example2.at(pos))
                .filter(unit => unit.isGoblin())
                .length.toBe(positions.length)
    };

    const tick0 =  [pos(1,1), pos(1,4), pos(1,7),
        pos(4,  1), pos(4,7),
        pos(7,  1), pos(7,4), pos(7,7)];
    elf.pos.eq(pos(4,4));
    checkGoblins(tick0);

    movingUnits.forEach(unit => unit.nextStep(example2));

    const tick1 =  [pos(1,2), pos(1,6),
        pos(4,2)];
    checkGoblins(tick1);


    return fileAsText('day15/input.txt').then(input => {
        //return solve(parseInt(input)).toBe('4910101614');
    });
};

export function solve(ripeness) {
}

function parse(input) {
    return input.split(/\r?\n|\n/g).reduce((acc, row, y) => {
        acc.push(... row.split('').map((self, x) => new Unit(self, pos(y,x))));
        return acc;
    },[])
}

class Unit {
    constructor(self, pos) {
        this.self = self;
        this.pos = pos;
    }
    isGoblin() {
        return this.self === 'G';
    }
    isElf() {
        return this.self === 'E';
    }
    isOpen() {
        return this.self === '.';
    }
    isWall() {
        return this.self === '#';
    }
    isEnemy(other) {
        const chkEnemy = (left, right) => left.isGoblin() && right.isElf();
        return chkEnemy(this, other) || chkEnemy(other, this);
    }
    targets(all) {
        return all.filter(other => this.isEnemy(other));
    }
    inRangeUnits(targets, all) {
        return [... targets.reduce((acc,target) => {
            all.filter(other => other.isOpen() && other.pos.isAdjacent(target.pos))
                .forEach(item => acc.add(item));
            return acc;
        },new Set())];
    }
    adjacent(all) {
        return all.filter(other => other.pos.isAdjacent(this.pos));
    }
    isReachable(toReach, all) {
        return this.path(toReach, all).length > 0;
    }
    path(toReach, all) { // shortest path in reading order or empty array
        const paths = this.reachablePaths(toReach, all);
        if(paths.length === 0) {
            return [];
        } else {
            // only keep shortest paths
            return Unit.choosePath(paths)
        }
    }
    reachablePaths(toReach, all, path = []) {
        const adjacent = this.adjacent(all);
        if(toReach === this) {
            return [path];
        } else {
            return adjacent.filter(other => other.isOpen() || other === toReach)
                .filter(other => !path.includes(other))
                .reduce((acc, curr) => {
                    const paths = curr.reachablePaths(toReach, all, [...path, curr]);
                    acc.push(... paths);
                    return acc
                }, []);
        }
    }
    nextStep(all) {
        const paths = this.targets(all).map(other => this.path(other, all));
        const path = Unit.choosePath(paths);
        if(path.length > 1) {
            let prevPosition = this.pos.copy();
            let nextPosition = path[0].pos.copy();
            // just switch the position of the units
            path[0].pos = prevPosition;
            this.pos = nextPosition;
        }
        return undefined;
    }

    static choosePath(paths) {
        // choose path by shortest and what is first in reading order
        const shortestStepsCnt = paths.reduce((left, right) => left.length < right.length ? left : right).length;
        const allShortest = paths.reduce((acc, path) => {
            if(path.length === shortestStepsCnt) {
                acc.push(path);
            }
            return acc;
        },[]);
        const firstStepInReadingOrder = allShortest.map(path => path[0]).first();
        return allShortest.filter(path => path[0] === firstStepInReadingOrder)[0];
    }
}

function pos(y,x) {
    return new Position(y,x);
}
class Position {
    constructor(y,x) {
        this.y = y;
        this.x = x;
    }
    isAdjacent(other) {
        return this.up().eq(other) || this.down().eq(other) || this.left().eq(other) || this.right().eq(other);
    }
    copy() {
        return new Position(this.y,this.x);
    }
    eq(other) {
        return this.x === other.x && this.y === other.y;
    }
    up() {
        return pos(this.y-1, this.x);
    }
    down() {
        return pos(this.y+1, this.x);
    }
    left() {
        return pos(this.y, this.x-1);
    }
    right() {
        return pos(this.y, this.x+1);
    }
    hash() {
        return `${this.y}_${this.x}`;
    }
}

// sorted in reading order
Array.prototype.sorted = function() {
    return this.sort((left, right) => {
                    const leftHash = left.pos ? left.pos.hash() : left.hash();
                    const rightHash = right.pos ? right.pos.hash() : right.hash();
                    if(leftHash === rightHash) {
                        return 0;
                    } else if(leftHash < rightHash) {
                        return -1;
                    } else if(leftHash > rightHash) {
                        return 1;
                    }
                });
};

Array.prototype.first = function () {
    return this.sorted()[0];
};
Array.prototype.at = function (position) {
    return this.filter(unit => unit.pos.eq(position))[0];
};
Array.prototype.last = function () {
    return this[this.length - 1];
};