import {fileAsText} from '../common/files.js'

export const EXAMPLE = `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`;

export const EXAMPLE_1 = `.......##.
......|###
.|..|...#.
..|#||...#
..##||.|#|
...#||||..
||...|||..
|||||.||.|
||||||||||
....||..|.`;
export const EXAMPLE_10 = `.||##.....
||###.....
||##......
|##.....##
|##.....##
|##....##|
||##.####|
||#####|||
||||#|||||
||||||||||`;


export default async function main() {
    let area = Area.parse(EXAMPLE);
    area.state[0].toBe([".", "#", ".", "#", ".", ".", ".", "|", "#", "."]);
    area.state[9].toBe([".", ".", ".", "#", ".", "|", ".", ".", "|", "."]);
    area.get(0, 1).toBe('.');
    area.get(1, 0).toBe('#');
    area.get(0, 6).toBe('.');
    area.get(7, 0).toBe('|');
    area.get(8, 0).toBe('#');
    area.nextAcre(0, 1).toBe('.'); // . -> .
    area.nextAcre(1, 0).toBe('.'); // . -> .
    area.nextAcre(0, 6).toBe('|'); // . -> |
    area.nextAcre(7, 0).toBe('#'); // | -> #
    area.nextAcre(8, 0).toBe('#'); // # -> #

    area = area.tick();
    let compareArea = Area.parse(EXAMPLE_1);
    area.state.toBe(compareArea.state);

    area = Area.parse(EXAMPLE).tick(10); // total of 10 ticks
    compareArea = Area.parse(EXAMPLE_10);
    area.state.toBe(compareArea.state);
    area.resourceValue.toBe(1147);


    return fileAsText('day18/input.txt').then(input => {
        const res = Area.parse(input).tick(10).resourceValue
        res.toBe(582494);
        return res;
    });
};

export class Area {
    static parse(input) {
        let parsed = input.split(/\r?\n|\n/g)
            .map(line => line.split(''));
        return new Area(parsed);
    }

    constructor(parsed) {
        this.state = parsed;
    }

    tick(amount = 1) {
        let res = this;
        // remember the first one
        let i = 0;
        let keyToIdMap = new Map();
        let idxMap = new Map();
        keyToIdMap.set(this.key, i);
        idxMap.set(i, this);
        i++;
        // run all next ones until there is a pattern or amount is reached
        let loopStartIdx = -1;
        do {
            res = res._tickOnce();
            if (keyToIdMap.has(res.key)) {
                loopStartIdx = keyToIdMap.get(res.key);
            } else {
                keyToIdMap.set(res.key, i);
                idxMap.set(i, res);
            }
            i++;
        } while (i <= amount && loopStartIdx === -1);
        if (loopStartIdx !== -1) {
            const maxIdx = [...idxMap.keys()].reduce((max, curr) => Math.max(max, curr), 0);
            const loopSize = maxIdx - loopStartIdx + 1; // loop size is inclusive start of loop (+1)
            let cursor = loopStartIdx;
            cursor += (amount - loopStartIdx) % loopSize;
            res = idxMap.get(cursor);
        }
        return res;
    }

    _tickOnce() {
        let newState = [];
        this.state.forEach((row, y) => {
            row.forEach((val, x) => {
                if (!newState[y]) {
                    newState[y] = []
                }
                newState[y][x] = this.nextAcre(x, y);
            })
        });
        return new Area(newState);
    }

    get(x, y) {
        return this.state[y] && this.state[y][x] ? this.state[y][x] : '.';
    }

    nextAcre(x, y) {
        let cur = this.get(x, y);
        let res = cur;
        const surroundings = [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
            [x - 1, y],/*cur*/ [x + 1, y],
            [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]].map(coord => this.get(coord[0], coord[1]));
        const treeCnt = surroundings.filter(item => item === '|').length;
        const lumberYardCnt = surroundings.filter(item => item === '#').length;
        if (cur === '.' && treeCnt >= 3) {
            res = '|';
        } else if (cur === '|' && lumberYardCnt >= 3) {
            res = '#';
        } else if (cur === '#' && lumberYardCnt >= 1 && treeCnt >= 1) {
            res = '#';
        } else if (cur === '#') {
            res = '.';
        }
        return res;
    }

    count(resource) {
        return this.state.reduce((acc, row) => acc + row.filter(acre => acre === resource).length, 0);
    }

    get resourceValue() {
        return this.count('|') * this.count('#');
    }

    get key() {
        return JSON.stringify(this.state);
    }
}