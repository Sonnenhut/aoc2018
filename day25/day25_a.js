import {fileAsText} from "../common/files.js";

const ENABLE_LOG = false;
export const EXAMPLE_0 =
`0,0,0,0
3,0,0,0
0,3,0,0
0,0,3,0
0,0,0,3
0,0,0,6
9,0,0,0
12,0,0,0`;
export const EXAMPLE_1 =
`-1,2,2,0
0,0,2,-2
0,0,0,-2
-1,2,0,0
-2,-2,-2,2
3,0,2,-1
-1,3,2,2
-1,0,-1,0
0,2,1,-2
3,0,0,0`;

export const EXAMPLE_2 =
`1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2`;

export const EXAMPLE_3 =
`1,-1,-1,-2
-2,-2,0,1
0,2,1,3
-2,3,-2,1
0,2,3,-2
-1,-1,1,-2
0,-2,-1,0
-2,2,3,-1
1,2,2,0
-1,-2,0,-2`;

export default async function main() {

    let l = combineGroups([[9,1],[2,3],[8,3],[9,2]]);
    l.length.toBe(1);
    l[0].sort().toBe([1,2,3,8,9]);

    l = combineGroups([[9,1],[9,2],[8,3],[8,4]]);
    l.length.toBe(2);
    l[0].sort().toBe([1,2,9]);
    l[1].sort().toBe([3,4,8]);

    let coords = parseCoords(EXAMPLE_0);
    l = resolveConstellations(coords);
    l.length.toBe(2);
    l[0].includes(coords[0]).toBe(true);
    l[0].includes(coords[1]).toBe(true);
    l[0].includes(coords[2]).toBe(true);
    l[0].includes(coords[3]).toBe(true);
    l[0].includes(coords[4]).toBe(true);
    l[0].includes(coords[5]).toBe(true);
    l[1].includes(coords[6]).toBe(true);
    l[1].includes(coords[7]).toBe(true);

    l = resolveConstellations(parseCoords(EXAMPLE_1));
    l.length.toBe(4);

    l = resolveConstellations(parseCoords(EXAMPLE_2));
    l.length.toBe(3);

    l = resolveConstellations(parseCoords(EXAMPLE_3));
    l.length.toBe(8);

    return fileAsText('day25/input.txt').then(input => {
        let res = resolveConstellations(parseCoords(input)).length;
        res.toBe(331);
        return res;
    });
};

function parseCoords(input) {
    return input.split('\n')
        .map(line => line.split(',').map(str => parseInt(str)));
}

function combineGroups(groups, idx=0) {
    let currGroup = groups[idx];
    const addedGrpIdx = [];
    let combined = groups.reduce((acc, grp, grpIdx) => {
        if(grpIdx !== idx) {
            let shouldCombine = false;
            for(let other of grp) {
                if(currGroup.includes(other)) {
                    shouldCombine = true;
                    break;
                }
            }
            if(shouldCombine) {
                addedGrpIdx.push(grpIdx);
                acc = acc.concat(grp);
            }
        }
        return acc
    },[]);
    combined = currGroup.concat(combined);
    groups[idx] = combined;
    groups = groups.filter((grp, idx) => !addedGrpIdx.includes(idx)); // ignore already added ones
    groups = groups.map((grp) => [...new Set(grp)]); // remove duplicates
    if(addedGrpIdx.length) {
        return combineGroups(groups, idx); //again with same group, because it now has more elements
    } else if(groups.length -1 === idx) { // at the end
        return groups;
    } else { // move forward
        return combineGroups(groups, idx+1);
    }
}

function resolveConstellations(coords) {
    const links = new Map();
    coords.forEach(coord => {
        const linked = coords.filter(other => inSameConstellation(coord, other));
        links.set(coord, [...new Set(linked.concat([coord]))])
    });
    const groups = [...links.values()];
    return combineGroups(groups)
}

function inSameConstellation(left, right) {
    const manhattanDistance = Math.abs(left[0] - right[0])
        + Math.abs(left[1] - right[1])
        + Math.abs(left[2] - right[2])
        + Math.abs(left[3] - right[3]);
    return manhattanDistance <= 3;
}