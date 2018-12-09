import {fileAsText} from '../common/files.js'

export default async function main() {

    Circle.calcNewIdx(5,0,1).toBe(1);
    Circle.calcNewIdx(5,0,5).toBe(0);
    Circle.calcNewIdx(9,6,-7).toBe(8);

    const testPlaceNextMarble = (input, expected) => {
        Circle.placeNextMarbleClockwise(input);
        input._circle.toBe(expected._circle);
        input._nextMarble.toBe(expected._nextMarble);
        input._currentMarbleIdx.toBe(expected._currentMarbleIdx);
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
        input._circle.toBe(expectedCirle._circle);
        input._nextMarble.toBe(expectedCirle._nextMarble);
        input._currentMarbleIdx.toBe(expectedCirle._currentMarbleIdx);
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


    solve(9, 25).toBe(32);
    solve(10, 1618).toBe(8317);
    solve(13, 7999).toBe(146373);
    solve(17, 1104).toBe(2764);
    solve(21, 6111).toBe(54718);
    solve(30, 5807).toBe(37305);

    return fileAsText('day09/input.txt').then(input => {
        let {players, lastMarble} = parse(input);
        return solve(players, lastMarble)
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
        this._circle = start;
        this._nextMarble = nextMarble;
        this._currentMarbleIdx = currentMarbleIdx;
    }
    static weirdLogic(circle) {
        let score = circle._nextMarble;
        let newIdx = Circle.calcNewIdx(circle._circle.length, circle._currentMarbleIdx, -7);
        const taken = circle._circle.splice(newIdx, 1)[0];
        if(newIdx === circle._circle.length) {
            // when we looped to the very end, start at 0
            circle._currentMarbleIdx = 0;
        } else {
            circle._currentMarbleIdx = newIdx;
        }
        score += taken;
        circle._nextMarble++;
        return score;
    }
    static calcNewIdx(size, currIdx, offset) {
        let res = currIdx + offset;
        return ((res % size) + size) % size; // really? just to support negative numbers...
    }
    static placeNextMarbleClockwise(circle) {
        // the index that is between one and two
        // also, the desired index has to be two off from the current marble
        let newIdx = circle._currentMarbleIdx;
        newIdx = newIdx + 2;
        if(newIdx === circle._circle.length) {
            // place the marble at the end
            circle._circle.push(circle._nextMarble);
        } else {
            // insert the marble at the specified point
            newIdx = newIdx % circle._circle.length;
            circle._circle.splice(newIdx, 0, circle._nextMarble);
        }
        circle._currentMarbleIdx = newIdx;
        circle._nextMarble++;
    }
}