import {fileAsText} from '../common/files.js'

// some old aoc to see test my setup
export default async function main() {
    solve('+1 -1').toBe(0);
    solve('+3 +3 +4 -2 -4').toBe(10);
    solve('-6 +3 +8 +5 -6').toBe(5);
    solve('+7 +7 -2 -7 -4').toBe(14);

    return fileAsText('day01/input.txt').then(input => {
        return solve(input).notToBe(0)
                            .toBe(566);
    });
};

function solve(input) {
    input = input.replace(/\r?\n|\n/g, ' ');
    input = input.split(' ').map(text => parseInt(text));
    let seq = infiniteSeq(input);

    let frequencies = [0];
    let currFreq = 0;
    let res = undefined;
    while (res === undefined) {
        currFreq += seq.next().value;
        if(frequencies.includes(currFreq)) {
            res = currFreq;
            break;
        } else {
            frequencies.push(currFreq);
        }
    }
    return res;
}

// generator function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
function* infiniteSeq(input) {
    while(true) {
        for (let item of input) {
            yield item;
        }
    }
}