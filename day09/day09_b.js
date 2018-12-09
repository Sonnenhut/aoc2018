import {fileAsText} from '../common/files.js'
import {solve as solve_a, parse} from './day09_a.js'

export default async function main() {
    return fileAsText('day09/input.txt').then(input => {
        let {players, lastMarble} = parse(input);
        return solve(players, lastMarble).toBe(3426843186);
    });
};

export function solve(playersCnt, lastMarble) {
    return solve_a(playersCnt, lastMarble * 100);
}