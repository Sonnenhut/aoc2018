import {fileAsText} from '../common/files.js'
import {solve as solve_a} from './day05_a.js'
import {abc} from "./day05_a.js";

export default async function main() {
    solve("dabAcCaCBAcCcaDA").toBe(4);

    return fileAsText('day05/input.txt').then(input => {
        return solve(input).toBe(4098);
    });
};

function solve(polymer) {
    return abc.split('').reduce((minimalLen, curr) => {
        const toSanitize = new RegExp(curr, 'gi');
        const sanitizedPolymer = polymer.replace(toSanitize,'');
        const challengeLen = solve_a(sanitizedPolymer);
        return challengeLen < minimalLen ? challengeLen : minimalLen;
    },999999999999)
}