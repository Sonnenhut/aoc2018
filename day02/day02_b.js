import {fileAsText} from '../common/files.js'


// some old aoc to see test my setup
export default async function main() {
    sameChars('abe', 'aze').toBe('ae');
    sameChars('fghij', 'fguij').toBe('fgij');
    solve('abcde abcxz abcfe').toBe('abce');

    return fileAsText('day02/input.txt').then(input => {
        return solve(input);
    });
};

function solve(input) {
    input = input.replace(/\r?\n|\n/g, ' ').split(' ');

    return input.map(start => {
       return input.map(compare => start === compare ? "" : sameChars(start, compare)).maxLength();
    }).maxLength();
}

function sameChars(left, right) {
    return left.split('').reduce((prev, curr, idx) => {
        return right.charAt(idx) === curr ? prev + curr : prev;
    }, '')
}

Array.prototype.maxLength = function() {
    return this.reduce((prev, curr) => curr.length > prev.length ? curr : prev) ;
};