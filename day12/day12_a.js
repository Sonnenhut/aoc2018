import {fileAsText} from '../common/files.js'

export const EXAMPLE_DAY = "initial state: #..#.#..##......###...###\n" +
    "\n" +
    "...## => #\n" +
    "..#.. => #\n" +
    ".#... => #\n" +
    ".#.#. => #\n" +
    ".#.## => #\n" +
    ".##.. => #\n" +
    ".#### => #\n" +
    "#.#.# => #\n" +
    "#.### => #\n" +
    "##.#. => #\n" +
    "##.## => #\n" +
    "###.. => #\n" +
    "###.# => #\n" +
    "####. => #";

export default async function main() {

    const testGet = new Map();
    testGet.set(1, '#');
    testGet.set(5, '#');
    get(0,7,testGet).toBe('.#...#.');
    get(0,2,testGet).toBe('.#');
    solve(EXAMPLE_DAY).toBe(325);

    return fileAsText('day12/input.txt').then(input => {
        return solve(input).toBe(3410);
    });
};

function get(from, take, map) {
    if(take > 0) {
        const curr = map.has(from) ? map.get(from) : '.';
        return curr + get(from + 1, take - 1, map)
    } else {
        return '';
    }
}

function hash(idx,map) {
    return get(idx-2,1,map) + get(idx-1,1,map) + get(idx,1,map) + get(idx+1,1,map) + get(idx+2,1,map);
}

function possibleHashes(idx, map) {
    // all possible hashes with the given idx
    return [-2,-1,0,1,2].reduce((acc, off) => {
        const newIdx = idx+off;
        acc.set(hash(newIdx, map), newIdx);
        return acc;
    },new Map());
}

export function solve(input, gen = 20) {
    const parsed = parse(input);
    let rules = parsed.rules;
    let pots = parsed.initial.split('').reduce((acc, item, idx) => {
        acc.set(idx, item);
        return acc;
    }, new Map());
    let constellations = [];

    let lastOffset = 0;
    let last = {const: parsed.initial, off: 0};
    while(constellations.filter(other => other.const === last.const).length === 0) {
        constellations.push(last);
        let newPots = new Map();
        // only iterate over indexes where a plant is
        for (let idx of pots.keys()) {
            for (let [theHash, hashIdx] of possibleHashes(idx , pots)) {
                const res = get(theHash, 1, rules);
                if (res === '#' && !newPots.has(hashIdx )) {
                    newPots.set(hashIdx, res);
                }
            }
        }
        const minKey = newPots.minKey();
        const take = newPots.maxKey() - minKey + 1;
        last = {const: get(minKey, take, newPots), off: minKey};
        lastOffset = last.off;
        pots = newPots;
    }

    const calcScore = (constellation, offset) => {
        return constellation.split('').reduce((acc, char, idx) => {
            if(char === '#') {
                const realIdx = idx + offset;
                acc += realIdx;
            }
            return acc;
        },0);
    };

    if(gen < constellations.length) {
        return calcScore(constellations[gen].const, constellations[gen].off);
    } else {
        // now the number is higher than any constellation we did
        // look at the last offset and calculate what offset the required gen is
        const loopingConst = constellations[constellations.length - 1];
        const loopingOffset = lastOffset - loopingConst.off;
        const off = (loopingOffset * (gen - (constellations.length - 1))) + loopingConst.off;
        return calcScore(loopingConst.const, off);
    }
}

function parse(txt) {
    const lines = txt.split(/\r?\n|\n/g);
    const initial = lines[0].split(': ')[1];
    const rules = lines.slice(2).reduce((acc, line) => {
        const [pattern, res] = line.split(' => ');
        acc.set(pattern,res);
        return acc;
    },new Map());
    return {initial, rules};
}

Map.prototype.maxKey = function() {
    return [...this.keys()].reduce((max, curr) => max > curr ? max : curr);
};
Map.prototype.minKey = function() {
    return [...this.keys()].reduce((min, curr) => min < curr ? min : curr);
};