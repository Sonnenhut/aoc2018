import {fileAsText} from '../common/files.js'

export const HORIZONTAL_EXAMPLE_0 = [`->---<-`.split('')];
export const HORIZONTAL_EXAMPLE_1 = [`-->-<--`.split('')];
export const HORIZONTAL_EXAMPLE_2 = [`---X---`.split('')];

export const DOWN_AT_CORNER_0 = [`>\\`.split(''),' |'.split('')];
export const DOWN_AT_CORNER_1 = [`-v`.split(''),' |'.split('')];


export default async function main() {
/*
    const moveLeftEx = modify(1,0,`->---<-`.split('').inflated());
    moveLeftEx.char.toBe('>');
    moveLeftEx.x.toBe(2);

    const noMoveEx = modify(0,0,`->---<-`.split('').inflated());
    noMoveEx.x.toBe(0);
    noMoveEx.y.toBe(0);
    noMoveEx.noop.toBe(true);
*/
    const testTick = (param, expected) => tick(param.inflated()).deflated().toBe(expected);
    testTick(HORIZONTAL_EXAMPLE_0, HORIZONTAL_EXAMPLE_1);
    testTick(HORIZONTAL_EXAMPLE_1, HORIZONTAL_EXAMPLE_2);
    testTick(DOWN_AT_CORNER_0, DOWN_AT_CORNER_1);


    fileAsText('day13/example_ticks.txt').then(input => {
        let exampleTicks = parseState(input);
        // check if all ticks match the example ticks
        let state = exampleTicks[0].inflated();
        for(let idx = 1; idx < exampleTicks.length; idx++) {
            state = tick(state);
            state.deflated().toBe(exampleTicks[idx]);
        }

        // try to solve with the example input
        let solveInput = exampleTicks[0].reduce((acc, row) => acc + row.join('') + "\n","");
        let exampleSolve = solve(solveInput);
        exampleSolve.x.toBe(7);
        exampleSolve.y.toBe(3);
    });

    return fileAsText('day13/input.txt').then(input => {
        const solved = solve(input);
        return `${solved.x},${solved.y}`.notToBe('93,104');
    });
};

export function solve(input) {
    let state = parseState(input)[0].inflated();
    let crashLoc;
    while(crashLoc === undefined) {
        state = tick(state);
        crashLoc = findCrashLoc(state);
    }
    return crashLoc;
}

export function parseState(input) {
    let rows = input.split(/\r?\n|\n/g);
    let ticks = [];
    let currTick = [];
    for(let row of rows) {
        if(row.length === 0) {
            ticks.push(currTick);
            currTick = [];
        } else {
            currTick.push(row.split(''));
        }
    }
    ticks.push(currTick);
    return ticks;
}

export function findCrashLoc(state) {
    for(let y = 0; y < state.length; y++) {
        for(let x = 0; x < state[y].length; x++) {
            if(state[y][x].self === 'X') {
                return {y,x};
            }
        }
    }
    return undefined;
}

let set = (char,y,x, arr) => {
    if(!arr[y]){
        arr[y] = [];
    }
    arr[y][x] = char;
};

export function tick(field) {
    let res = [];

    field.forEach((y,yIdx) => {
        y.forEach((x,xIdx) => set(field[yIdx][xIdx], yIdx, xIdx, res))
    });

    let ignoreX = [];
    let ignoreY = [];
    for(let y = 0; y < res.length; y++) {
        for(let x = 0; x < res[y].length; x++) {
            if(!(ignoreX.includes(x) && ignoreY.includes(y))) {
                let mod = modify(y,x,res);
                if(mod.noop) {
                    set(mod.new,y, x, res);
                } else {
                    set(mod.old, y, x, res);
                    set(mod.new, mod.y, mod.x, res);
                    // dont look at this coordinate for this tick, already changed
                    ignoreX.push(mod.x);
                    ignoreY.push(mod.y);
                }
            }
        }
    }
    return res;
}

function modify(y, x, field) {
    let cell = field[y][x];
    let res = {new: cell, old: cell, x, y};

    switch(cell.self) {
        case '^':
            res.y -= 1;
            break;
        case 'v':
            res.y += 1;
            break;
        case '<':
            res.x -= 1;
            break;
        case '>':
            res.x += 1;
            break;
        default:
            res.noop = true;
            break;
    }
    res.old = Cell.toOldSelf(cell);

    let toOverwrite = field[res.y][res.x];
    res.new = new Cell(cell.self, cell.turns, toOverwrite.self);

    if(toOverwrite.isIntersection() && cell.isMoving()) {
        res.new = cell.nextMoveAtIntersection();
    } else if(toOverwrite.isMoving()) {
        res.new = new Cell("X"); // BOOM CRASH!
    } else if(toOverwrite.isCurve() && cell.isMoving()) {
        let rules = [];
        set('<', '^', '\\', rules);
        set('>', 'v', '\\', rules);
        set('v', '>', '\\', rules);
        set('^', '<', '\\', rules);
        set('>', '^', '/', rules);
        set('<', 'v', '/', rules);
        set('^', '>', '/', rules);
        set('v', '<', '/', rules);
        res.new = new Cell(rules[cell.self][toOverwrite.self], cell.turns, toOverwrite.self);
    }
    return res;
}

class Cell {
    constructor(val, turns = 0, oldSelf) {
        this.self = val;
        this.turns = turns;
        this.oldSelf = oldSelf;
    }
    nextMoveAtIntersection() {
        const rules = new Map();
        rules.set('^',['<','^','>']);
        rules.set('v',['>','v','<']);
        rules.set('<',['v','<','^']);
        rules.set('>',['^','>','v']);

        const lur = rules.get(this.self);
        let res = lur[this.turns % 3];
        this.turns++;
        return new Cell(res, this.turns,'+');
    }
    isMoving() {
        return '<>^v'.includes(this.self);
    }
    isIntersection() { // is or was in some point of time
        return '+' === this.self;
    }
    isCurve() {
        return '\\/'.includes(this.self);
    }
    static toOldSelf(cell) {
        let newSelf = cell.oldSelf;
        if(!cell.oldSelf) {
            if('<>'.includes(cell.self)) {
                newSelf = '-';
            } else if('^v'.includes(cell.self)) {
                newSelf = '|';
            }
        }
        return new Cell(newSelf, 0, cell.oldSelf);
    }
}

Array.prototype.inflated = function() {
    let res = [];
    for(let y = 0; y < this.length; y++) {
        for (let x = 0; x < this[y].length; x++) {
            set(new Cell(this[y][x]), y, x, res);
        }
    }
    return res;
};

Array.prototype.deflated = function() {
    let res = [];
    for(let y = 0; y < this.length; y++) {
        for (let x = 0; x < this[y].length; x++) {
            set(this[y][x].self, y, x, res);
        }
    }
    return res;
};