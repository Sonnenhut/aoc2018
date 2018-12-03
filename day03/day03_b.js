import {fileAsText} from '../common/files.js'
import {Claim} from './day03_a.js';
import {overwriteFabric} from "./day03_a.js";

// some old aoc to see test my setup
export default async function main() {
    expect(solve('#1 @ 1,1: 2x2\n#2 @ 2,1: 2x2')).toBe(undefined);
    solve('#1 @ 1,3: 4x4\n#2 @ 3,1: 4x4\n#3 @ 5,5: 2x2').toBe(3);

    return fileAsText('day03/input.txt').then(input => {
       return solve(input).toBe(1046);
    });
};

export function solve(input) {
    const claims = input.split(/\r?\n|\n/g).map(text => Claim.parse(text));
    let fabric = [];
    const overwrittenClaimIds = claims.reduce((overwIds, claim) => {
        const overwritten = overwriteFabric(fabric, claim);
        [... overwritten].forEach(item => overwIds.add(item));
        return overwIds;
    }, new Set());

    const notOverwritten = claims.map(claim => claim.id).filter(id => {
        return !overwrittenClaimIds.has(id);
    });
    return notOverwritten[0];
}