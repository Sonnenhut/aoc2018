import {fileAsText} from '../common/files.js'
import {PriorityQueue} from "../day20/PriorityQueue.js";

const EXAMPLE_0_DAY =
    "#######\n" +
    "#E..G.#\n" +
    "#...#.#\n" +
    "#.G.#G#\n" +
    "#######";

const EXAMPLE_MOVEMENT_0 =
    "#########\n" +
    "#G..G..G#\n" +
    "#.......#\n" +
    "#.......#\n" +
    "#G..E..G#\n" +
    "#.......#\n" +
    "#.......#\n" +
    "#G..G..G#\n" +
    "#########";

const EXAMPLE_MOVEMENT_1 =
    "#########\n" +
    "#.G...G.#\n" +
    "#...G...#\n" +
    "#...E..G#\n" +
    "#.G.....#\n" +
    "#.......#\n" +
    "#G..G..G#\n" +
    "#.......#\n" +
    "#########";

const EXAMPLE_MOVEMENT_2 =
    "#########\n" +
    "#..G.G..#\n" +
    "#...G...#\n" +
    "#.G.E.G.#\n" +
    "#.......#\n" +
    "#G..G..G#\n" +
    "#.......#\n" +
    "#.......#\n" +
    "#########";

const EXAMPLE_MOVEMENT_3 =
    "#########\n" +
    "#.......#\n" +
    "#..GGG..#\n" +
    "#..GEG..#\n" +
    "#G..G...#\n" +
    "#......G#\n" +
    "#.......#\n" +
    "#.......#\n" +
    "#########";

const EXAMPLE_BATTLE_0 =
    "G....\n" +
    "..G..\n" +
    "..EG.\n" +
    "..G..\n" +
    "...G.";

const EXAMPLE_BATTLE_1 =
    "G....\n" +
    "..G..\n" +
    "..E..\n" +
    "..G..\n" +
    "...G.";

const EXAMPLE_47_ROUNDS =
    "#######\n" +
    "#.G...#\n" +
    "#...EG#\n" +
    "#.#.#G#\n" +
    "#..G#E#\n" +
    "#.....#\n" +
    "#######";

const EXAMPLE_47_AFTER_1 =
    "#######\n" +
    "#..G..#\n" +
    "#...EG#\n" +
    "#.#G#G#\n" +
    "#...#E#\n" +
    "#.....#\n" +
    "#######";

const EXAMPLE_47_AFTER_2 =
    "#######\n" +
    "#...G.#\n" +
    "#..GEG#\n" +
    "#.#.#G#\n" +
    "#...#E#\n" +
    "#.....#\n" +
    "#######";
const EXAMPLE_47_AFTER_23 =
    "#######\n" +
    "#...G.#\n" +
    "#..G.G#\n" +
    "#.#.#G#\n" +
    "#...#E#\n" +
    "#.....#\n" +
    "#######";

const EXAMPLE_37_ROUNDS =
    "#######\n" +
    "#G..#E#\n" +
    "#E#E.E#\n" +
    "#G.##.#\n" +
    "#...#E#\n" +
    "#...E.#\n" +
    "#######";


const EXAMPLE_35_ROUNDS =
    "#######\n" +
    "#E.G#.#\n" +
    "#.#G..#\n" +
    "#G.#.G#\n" +
    "#G..#.#\n" +
    "#...E.#\n" +
    "#######";

const EXAMPLE_54_ROUNDS =
    "#######\n" +
    "#.E...#\n" +
    "#.#..G#\n" +
    "#.###.#\n" +
    "#E#G#G#\n" +
    "#...#G#\n" +
    "#######";

const EXAMPLE_20_ROUNDS =
    "#########\n" +
    "#G......#\n" +
    "#.E.#...#\n" +
    "#..##..G#\n" +
    "#...##..#\n" +
    "#...#...#\n" +
    "#.G...G.#\n" +
    "#.....G.#\n" +
    "#########";

const EXAMPLE_46_ROUNDS =
    "#######\n" +
    "#E..EG#\n" +
    "#.#G.E#\n" +
    "#E.##E#\n" +
    "#G..#.#\n" +
    "#..E#.#\n" +
    "#######";

const EXAMPLE_WHICH_WAY =
    "#######\n" +
    "#.E..G#\n" +
    "#.#####\n" +
    "#G#####\n" +
    "#######";

const EXAMPLE_DIRECTLY_ATTACK =
    "####\n" +
    "#GG#\n" +
    "#.E#\n" +
    "####";

const EXAMPLE_REDDIT_71 =
    "#####\n" +
    "#GG##\n" +
    "#.###\n" +
    "#..E#\n" +
    "#.#G#\n" +
    "#.E##\n" +
    "#####";

const EXAMPLE_REDDIT_67 =
    "####\n" +
    "##E#\n" +
    "#GG#\n" +
    "####";

const EXAMPLE_REDDIT_38 =
    "################\n" +
    "#.......G......#\n" +
    "#G.............#\n" +
    "#..............#\n" +
    "#....###########\n" +
    "#....###########\n" +
    "#.......EG.....#\n" +
    "################";

const EXAMPLE_REDDIT_66 =
    "######################\n" +
    "#...................E#\n" +
    "#.####################\n" +
    "#....................#\n" +
    "####################.#\n" +
    "#....................#\n" +
    "#.####################\n" +
    "#....................#\n" +
    "###.##################\n" +
    "#EG.#................#\n" +
    "######################";

const EXAMPLE_REDDIT_IN_READING_ORDER =
    "#######\n" +
    "#..E#G#\n" +
    "#.....#\n" +
    "#G#...#\n" +
    "#######";

const EXAMPLE_WHICH_WAY_PT2 =
    "#######\n" +
    "#####G#\n" +
    "#..E..#\n" +
    "#G#####\n" +
    "#######";

export default async function main() {
    const moveAll = (squares) => {
        [...squares].forEach(sq => sq.move(squares));
        return Square.inReadingOrder(squares);
    };

    let squares = parseSquares(EXAMPLE_0_DAY);

    let reversed = squares.reverse();
    // test reading order
    parseSquares(EXAMPLE_0_DAY).map(sq => sq.type).toBe(Square.inReadingOrder(reversed).map(sq => sq.type));

    // test parsing
    Square.asString(squares).toBe(EXAMPLE_0_DAY);

    Square.at(squares,{x:1,y:1}).type.toBe('E');
    Square.at(squares,{x:5,y:3}).type.toBe('G');


    // test moves
    squares = parseSquares(EXAMPLE_MOVEMENT_0);
    squares = moveAll(squares);
    Square.asString(squares).toBe(EXAMPLE_MOVEMENT_1);

    squares = moveAll(squares);
    Square.asString(squares).toBe(EXAMPLE_MOVEMENT_2);
    squares = moveAll(squares);
    Square.asString(squares).toBe(EXAMPLE_MOVEMENT_3);

    squares = parseSquares(EXAMPLE_WHICH_WAY);
    let elve = Square.at(squares, {x:2,y:1});
    elve.type.toBe("E");
    elve.move(squares);
    Square.at(squares,{x:3,y:1}).type.toBe('E'); // elve should move right
    Square.at(squares,{x:1,y:1}).type.toBe('.'); // not left!


    squares = parseSquares(EXAMPLE_WHICH_WAY_PT2);
    elve = Square.at(squares, {x:3,y:2});
    elve.type.toBe("E");
    elve.move(squares);
    Square.at(squares,{x:2,y:2}).type.toBe('E'); // elve should move left
    Square.at(squares,{x:4,y:2}).type.toBe('.'); // not right!

    // test attack
    squares = parseSquares(EXAMPLE_BATTLE_0);
    Square.at(squares, {x:0,y:0}).hp = 9;
    Square.at(squares, {x:2,y:1}).hp = 4;
    Square.at(squares, {x:3,y:2}).hp = 2; // <- should be target
    Square.at(squares, {x:2,y:3}).hp = 2;
    Square.at(squares, {x:3,y:4}).hp = 1;
    elve = Square.at(squares, {x:2,y:2});
    const attackedGob = Square.at(squares, {x:3,y:2});
    elve.attack(squares);
    attackedGob.hp.toBe(-1);
    Square.asString(squares).toBe(EXAMPLE_BATTLE_1);

    squares = parseSquares(EXAMPLE_DIRECTLY_ATTACK);
    squares.forEach(sq => sq.turn(squares));
    Square.at(squares, {x:2,y:2}).type.toBe('E');

    squares = parseSquares(EXAMPLE_REDDIT_IN_READING_ORDER);
    squares = moveAll(squares);
    Square.at(squares, {x:2,y:1}).type.toBe('E');

    // test taking turns
    testExample47();


    outcome(EXAMPLE_47_ROUNDS).toBe([47, 590]);
    outcome(EXAMPLE_37_ROUNDS).toBe([37, 982]);
    outcome(EXAMPLE_46_ROUNDS).toBe([46, 859]);
    outcome(EXAMPLE_35_ROUNDS).toBe([35, 793]);
    outcome(EXAMPLE_54_ROUNDS).toBe([54, 536]);
    outcome(EXAMPLE_20_ROUNDS).toBe([20, 937]);
    //outcome(EXAMPLE_REDDIT_67).toBe([67, 200]);// <- still a bug here
    outcome(EXAMPLE_REDDIT_38).toBe([38, 486]);

    //outcome(EXAMPLE_REDDIT_71).toBe([71, 197]);
    //outcome(EXAMPLE_REDDIT_66).toBe([66, 202]);

    return fileAsText('day15/input.txt').then(input => {
        let res = outcome(input);
        res = res[0] * res [1];
        res.toBe(201856);
        return res;
    });
};

function testExample47() {
    const turn = (sqs) => {
        sqs = Square.inReadingOrder(sqs);
        [...sqs].forEach(sq => sq.turn(sqs));
        return Square.inReadingOrder(sqs);
    };
    let squares = parseSquares(EXAMPLE_47_ROUNDS);
    squares = turn(squares);
    Square.asString(squares).toBe(EXAMPLE_47_AFTER_1);
    squares = turn(squares);
    Square.asString(squares).toBe(EXAMPLE_47_AFTER_2);
    for(let i=0; i < (23-2); i++){
        squares = turn(squares);
    }
    Square.asString(squares).toBe(EXAMPLE_47_AFTER_23);
}

function outcome(input) {
    let squares = parseSquares(input);
    let typesPresent = (arr, type) => arr.filter(sq => sq.type === type).length > 0;
    let roundCnt = 0;
    loop: while(true) {//typesPresent(squares, 'E') && typesPresent(squares, 'G')
        roundCnt++;
        squares = Square.inReadingOrder(squares);

        let toTurn = squares.filter(sq => sq.canturn);
        for(let sq of toTurn) {
            squares = Square.inReadingOrder(squares);
            if(!typesPresent(squares, 'E') || !typesPresent(squares, 'G')) {
                break loop;
            }
            sq.turn(squares);
        }
    }

    roundCnt--;
    squares = Square.inReadingOrder(squares);

    console.log(Square.asString(squares));
    const hpSum = squares.filter(sq => sq.type === 'E' || sq.type === 'G')
        .map(sq => sq.hp)
        .reduce((acc, curr) => acc + curr,0);
    console.log(roundCnt, hpSum, squares.filter(sq => sq.type === 'E' || sq.type === 'G'));
    return [roundCnt, hpSum];
}

function parseSquares(input) {
    let rows = input.split('\n');
    let res = [];
    rows.forEach((row, y) => [...row].forEach((char, x) => res.push(new Square({x,y}, char))));
    return res;
}

class Square {
    constructor(pos, type) {
        this.type = type;
        this.x = pos.x;
        this.y = pos.y;
        this.hp = 200;
        this.ap = 3;
    }
    get dead(){
        return this.hp <= 0;
    }
    get canturn() {
        return this.type === 'G' || this.type === 'E'
    }
    get targetType() {
        return this.type === 'G' ? 'E' : 'G';
    }
    turn(units) {
        units = Square.inReadingOrder(units);
        let enemiesLeft = this._findTargets(units).length > 0;
        if(!this.dead && this.canturn) {
            this.move(units);
            this.attack(units);
        }
        return enemiesLeft;
    }
    move(units) {
        units = Square.inReadingOrder(units);
        if(this.type !== 'E' && this.type !== 'G') {
            return undefined;
        }
        const isNextToTarget = this.adjacent(units, this.targetType).length > 0;
        if(isNextToTarget) { // don't need a move
            return undefined;
        }
        const targets = this._findTargets(units);
        let inRange = targets.reduce((acc, curr) => acc.concat(curr.adjacent(units,'.')), []);
        inRange = Square.inReadingOrder(inRange);
        let dij = new Dijkstra(units, this);
        let dijkSquares = dij.run(); // sets distances
        //console.log(distances, targetLocations)
        let dijkInRange = inRange.map(loc => Square.at(dijkSquares, loc));
        const lowestDistance = dijkInRange.map(sq => sq.distance).reduce((acc, curr) => Math.min(acc, curr),Number.MAX_SAFE_INTEGER);
        const chosen = dijkInRange.filter(sq => sq.distance === lowestDistance)[0];
        if(chosen && chosen.distance !== Number.MAX_SAFE_INTEGER) { // move if possible
            const path = Dijkstra.shortestPath(chosen);
            const moveTarget = path[1];
            const emptySq = Square.at(units, moveTarget);
            emptySq.x = this.x;
            emptySq.y = this.y; // switch places with empty spot
            this.x = moveTarget.x;
            this.y = moveTarget.y;
        }
    }
    attack(units) {
        units = Square.inReadingOrder(units);
        let targets = this.adjacent(units, this.targetType);
        const lowestHpOfTarget = targets.map(target => target.hp).reduce((acc, curr) => Math.min(acc, curr),Number.MAX_SAFE_INTEGER);
        const target = Square.inReadingOrder(targets.filter(other => other.hp === lowestHpOfTarget))[0];
        if(target) {
            target.hp -= this.ap;
            if(target.hp <= 0) {
                target.type = '.'; // mark as dead
            }
        }
    }
    _findTargets(units) {
        let res = units.filter(other => other.type === this.targetType);
        return Square.inReadingOrder(res);
    }
    adjacent(units, type) {
        return Square.inReadingOrder(Square.around(this, units, type));
    }
    isNextTo(other) {
        return Square.isNextTo(this, other);
    }
    static isNextTo(at, other) {
        return (at.x - 1 === other.x && at.y === other.y)
            || (at.x + 1 === other.x && at.y === other.y)
            || (at.x === other.x && at.y - 1 === other.y)
            || (at.x === other.x && at.y + 1 === other.y)
    }
    static around(at, units, type) {
        let res = units.filter(other =>
            other.type === type && Square.isNextTo(at, other)
        );
        return Square.inReadingOrder(res);
    }
    static at(squares, loc) {
        return squares.filter(other => other.x === loc.x && other.y === loc.y)[0] || undefined;
    }
    static inReadingOrder(squares) {
        return [...squares].sort((left, right) => {
            let res = left.y - right.y;
            if(res === 0) {
                res = left.x - right.x;
            }
            return res;
        })
    }
    static asString(squares) {
        let res = [];
        squares.forEach(square => {
            let row = res[square.y] || [];
            row[square.x] = square.type;
            res[square.y] = row;
        });
        return res.map(row => row.reduce((strAcc, str) => strAcc + str ,''))
            .join('\n')
    }
}

export class Dijkstra {
    constructor(squares, startUnit) {
        this.squares = squares.map(square => Object.assign({}, square));
        for(let square of this.squares) {
            square.distance = Number.MAX_SAFE_INTEGER;
            square.prev = undefined;
        }
        Square.at(this.squares, startUnit).distance = 0;
        this.queue = new PriorityQueue([... this.squares], (node) => node.distance);
    }
    run() {
        while(this.queue.length) {
            let curr = this._nextInQueue();
            let neighbors = this._neighborsOf(curr);
            for(let neighbor of neighbors) {
                if(this.queue.includes(neighbor)) {
                    this._updateDistance(curr, neighbor);
                }
            }
        }
        return this.squares;
    }
    _updateDistance(u,v) {
        let alt = u.distance + 1;
        if(alt < v.distance) {
            const oldDistance = v.distance;
            v.distance = alt;
            v.prev = u;
            this.queue.resort(v, oldDistance)
        } else if(alt === v.distance) {
            // always prefer a path that is in reading order
            v.prev = Square.inReadingOrder([u, v.prev])[0];
        }
    }
    _nextInQueue() {
        return this.queue.next();
    }
    _neighborsOf(loc) {
        return Square.around(loc, this.squares,'.');
    }
    static shortestPath(target) {
        let path = [target];
        let u = target;
        while(u.prev) {
            u = u.prev;
            path.unshift(u);
        }
        return path;
    }
}

/*
export default async function main() {

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
};*/