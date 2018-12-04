import {fileAsText} from '../common/files.js'

export default async function main() {
    solve('aa').toBe(0);
    solve('aabb').toBe(0);
    solve('ababab').toBe(0);
    solve('aaabbbcc').toBe(1);

    solve('abcdef').toBe(0);
    solve('bababc').toBe(1);
    solve('abbcde').toBe(0);
    solve('abcccd').toBe(0);
    solve('aabcdd').toBe(0);
    solve('abcdee').toBe(0);
    solve('ababab').toBe(0);
    solve('abcdef\nbababc\nabbcde\nabcccd\naabcdd\nabcdee\nababab').toBe(12);

    return fileAsText('day02/input.txt').then(input => {
        return solve(input);
    });
};

function solve(input) {
    input = input.replace(/\r?\n|\n/g, ' ');
    const rawNo = input.split(' ').map(id => {
        let map = id.split('').reduce((prev, curr) => {
            prev.inc(curr);
            return prev;
        }, new Map());
        const twoCnt = [ ...map.values() ].includes(2) ? 1 : 0;
        const threeCnt = [ ...map.values() ].includes(3) ? 1 : 0;
        return [twoCnt, threeCnt];
    });
    const twoCnt = rawNo.map(item => item[0]).reduce((prev, curr) => prev + curr);
    const threeCnt = rawNo.map(item => item[1]).reduce((prev, curr) => prev + curr);
    return twoCnt * threeCnt;
}