import {fileAsText} from '../common/files.js'
import {EXAMPLE_DAY, solve as solve_a} from './day12_a.js'

export default async function main() {
    // example repeats after gen 86 and increases the offset by 1
    solve_a(EXAMPLE_DAY,86).toBe(1094);
    solve_a(EXAMPLE_DAY,87).toBe(1114);

    return fileAsText('day12/input.txt').then(input => {
        return solve_a(input, 50000000000)
                .notToBe(1375438599303) // too low
                .notToBe(7999999987640) // too high
                .notToBe(227999999490680) // wrong
                .toBe(4000000001480);
    });
};
