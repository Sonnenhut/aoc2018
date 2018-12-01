import {fileAsText} from '../common/files.js'

// some old aoc to see test my setup
export default async function main() {
    solve('+1 +1 +1').toBe(3);
    solve('+1 +1 -2').toBe(0);
    solve('-1 -2 -3').toBe(-6);

    return fileAsText('day01/input.txt').then(input => {
        return solve(input).notToBe(-7)
                            .toBe(454);
    });
};

function solve(input) {
    input = input.replace(/\r?\n|\n/g, ' ');
    return input.split(' ').reduce((prev, curr) => {
        return prev + parseInt(curr);
    }, 0);
}