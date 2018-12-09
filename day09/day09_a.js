import {fileAsText} from '../common/files.js'

export default async function main() {
    const marble012 = Marble.createRing(0,1,2);
    marble012.self.toBe(0);
    marble012.cw.self.toBe(1);
    marble012.cw.cw.self.toBe(2);
    marble012.cw.cw.cw.self.toBe(marble012.self);
    marble012.ccw.self.toBe(2);
    marble012.ccw.ccw.self.toBe(1);
    marble012.ccw.ccw.ccw.self.toBe(marble012.self);

    const testPlaceNextMarble = (input, expected) => {
        Circle.placeNextMarbleClockwise(input);
        input._marble.self.toBe(expected._marble.self);
        input._nextMarble.toBe(expected._nextMarble);
    };
    // test circle marble placement
    const circle2 = () => new Circle([0,(2),1],3,1);
    const circle3 = () => new Circle([0,2,1,(3)],4,3);
    const circle4 = () => new Circle([0,(4),2,1,3],5,1);
    testPlaceNextMarble(circle2(), circle3());
    testPlaceNextMarble(circle3(), circle4());

    const circle13 = () => new Circle([0,8,4,9,2,10,5,11,1,12,6,(13),3,7], 14, 11);
    const circle14 = () => new Circle([0,8,4,9,2,10,5,11,1,12,6,13,3,(14),7], 15, 13);
    const circle15 = () => new Circle([0,8,4,9,2,10,5,11,1,12,6,13,3,14,7,(15)], 16, 15);
    testPlaceNextMarble(circle13(),circle14());
    testPlaceNextMarble(circle14(),circle15());

    const testWeirdLogic = (input, expectedCirle, result) => {
        const res = Circle.weirdLogic(input);
        res.toBe(result);
        input._marble.self.toBe(expectedCirle._marble.self);
        input._nextMarble.toBe(expectedCirle._nextMarble);
    };
    // test weird logic (from example)
    testWeirdLogic(new Circle([0,16,8,17,4,18,9,19,2,20,10,21,5,(22),11,1,12,6,13,3,14,7,15,],23,13),
        new Circle([0,16,8,17,4,18,(19),2,20,10,21,5,22,11,1,12,6,13,3,14,7,15,],24,6),
        23 + 9);
    // remove -7th which is the last idx, should start at the first
    testWeirdLogic(new Circle([0,16,8,17,4,18,(9),19,2,20,10,21,5,22,11,1,12,6,13,3,14,7,15],23,6),
        new Circle([(0),16,8,17,4,18,9,19,2,20,10,21,5,22,11,1,12,6,13,3,14,7],24,0),
        23 + 15);
    // remove -7th which is the one before the last idx, should start at the last idx
    testWeirdLogic(new Circle([0,16,8,17,4,(18),9,19,2,20,10,21,5,22,11,1,12,6,13,3,14,7,15],23,5),
        new Circle([0,16,8,17,4,18,9,19,2,20,10,21,5,22,11,1,12,6,13,3,14,(15)],24,21),
        23 + 7);

    return fileAsText('day09/input.txt').then(input => {
        let {players, lastMarble} = parse(input);
        return solve(players, lastMarble).toBe(402398);
    });
};

export function solve(playersCnt, lastMarble) {
    let circle = new Circle([0,2,1],3,1);

    let players = new Array(playersCnt);
    players.fill(0);

    while(circle._nextMarble <= lastMarble) {
        const marble = circle._nextMarble;
        const playerIdx = marble % players.length;
        if(marble % 23 === 0) {
            const score = Circle.weirdLogic(circle);
            players[playerIdx] += score;
        } else {
            Circle.placeNextMarbleClockwise(circle);
        }
    }
    return players.reduce((highest, current) => highest > current ? highest : current);
}

export function parse(input) {
    const playersStr =/(.*) players/.exec(input)[1];
    const lastMarbleStr = /worth (.*) points/.exec(input)[1];
    return ({players: parseInt(playersStr), lastMarble: parseInt(lastMarbleStr)});
}

class Circle {
    constructor(start, nextMarble, currentMarbleIdx) {
        this._nextMarble = nextMarble;
        this._nextMarble = nextMarble;
        this._marble = Marble.createRing(...start);
        for(let i = 0; i < currentMarbleIdx; i++) {
            this._marble = this._marble.cw;
        }
    }
    static weirdLogic(circle) {
        let score = circle._nextMarble;
        const removeMarble = circle._marble.ccw.ccw.ccw.ccw.ccw.ccw.ccw; // -7
        circle._marble = removeMarble.cw; // set the selected marble next to the removed one
        removeMarble.ccw.setCW(removeMarble.cw); // just skip the marble, then it's gone
        score += removeMarble.self;
        circle._nextMarble++;
        return score;
    }
    static placeNextMarbleClockwise(circle) {
        const newMarble = new Marble(circle._nextMarble);
        const ccwMarble = circle._marble.cw;
        const cwMarble = ccwMarble.cw;
        newMarble.setCCW(ccwMarble);
        newMarble.setCW(cwMarble);
        circle._nextMarble++;
        circle._marble = newMarble;
    }
}

class Marble {
    constructor(self, ccw, cw) {
        this.self = self;
        this.ccw = ccw;
        this.cw = cw;
    }
    setCCW(marble, bounce = true) {
        this.ccw = marble;
        if(bounce) {
            marble.setCW(this, false);
        }
    }
    setCW(marble, bounce = true) {
        this.cw = marble;
        if (bounce) {
            marble.setCCW(this, false);
        }
    }
    static createRing(... args) {
        let first;
        let ccw;
        for(let arg of args) {
            if(!first) {
                first = new Marble(arg);
                ccw = first;
            } else {
                const newMarble = new Marble(arg);
                newMarble.setCCW(ccw);
                ccw = newMarble;
            }
        }
        // close the circle
        first.setCCW(ccw);
        return first;
    }
}