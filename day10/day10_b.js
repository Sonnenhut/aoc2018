import {fileAsText} from '../common/files.js'
import {EXAMPLE_DAY, parse, solve as solve_a} from './day10_a.js';

export default async function main() {
    const coordsExample = parse(EXAMPLE_DAY);
    solve(coordsExample).toBe(3);
    return fileAsText('day10/input.txt').then(input => {
        const coords = parse(input);
        return solve(coords);
    });
};

export function solve(coords) {
    const {iterations, snapshots} = solve_a(coords);
    // dont compute another time. start rendering right away
    const day10 = document.getElementsByTagName("day-10");
    if(day10) {
        day10[0].startRender(snapshots);
    }
    return iterations;
}