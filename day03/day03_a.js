import {fileAsText} from '../common/files.js'

// some old aoc to see test my setup
export default async function main() {
    const testClaim = Claim.parse('#122 @ 286,440: 19x24');
    testClaim.id.toBe(122);
    testClaim.x.toBe(286);
    testClaim.y.toBe(440);
    testClaim.w.toBe(19);
    testClaim.h.toBe(24);
    rangeForLen(1,2).toBe([1,2]);
    solve('#1 @ 1,1: 2x2\n#2 @ 2,1: 2x2').toBe(2);
    solve('#1 @ 1,3: 4x4\n#2 @ 3,1: 4x4\n#3 @ 5,5: 2x2').toBe(4);

    return fileAsText('day03/input.txt').then(input => {
       return solve(input).notToBe(91710) // too low
            .notToBe(122026) // too high
            .toBe(115242);
    });
};

function solve(input) {
    const claims = input.split(/\r?\n|\n/g).map(text => Claim.parse(text));
    let claimedFabric = claims.reduce((fabric, claim) => {
        overwriteFabric(fabric, claim);
        return fabric;
    }, []);
    return claimedFabric.reduce((prev, row) => {
        return prev + row.reduce((prev, elem) => elem === 'X' ? prev + 1 : prev, 0)
    }, 0);
}

// writes the claim id to the fabric
// returns a Set of all other claims that have been overwritten in the process
export function overwriteFabric(fabric, claim) {
    let res = new Set();
    for(let x of rangeForLen(claim.x, claim.w)) {
        for (let y of rangeForLen(claim.y, claim.h)) {
            let value = claim.id;
            if(fabric[x] === undefined) {
                fabric[x] = [];
            } else if(fabric[x][y]) {
                res.add(fabric[x][y]);
                res.add(value);
                value = 'X';
            }
            fabric[x][y] = value;
        }
    }
    return res;
}

function rangeForLen(start, len) {
    const end = start + len - 1;
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

export class Claim {
    constructor(id, x, y, w, h){
        this.id = parseInt(id);
        this.x  = parseInt(x);
        this.y  = parseInt(y);
        this.w  = parseInt(w);
        this.h  = parseInt(h);
    }
    static parse(text) {
        //#1 @ 286,440: 19x24
        const split = text.split(' ');
        //(#1) (@) (286,440:) (19x24)
        const id = split[0].replace('#','');
        const xyCoords = split[2].replace(':','').split(',');
        const whCoords = split[3].split('x');
        return new Claim(id, xyCoords[0], xyCoords[1],whCoords[0], whCoords[1]);
    }
}