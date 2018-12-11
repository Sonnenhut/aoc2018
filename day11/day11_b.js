import {fileAsText} from '../common/files.js'
import {solve as solve_a} from './day11_a.js';

export default async function main() {
/*
    const {cell: solve18Cell, dimension: solve18dimension} = solve(18);
    solve18Cell.x.toBe(90);
    solve18Cell.y.toBe(269);
    solve18dimension.toBe(16);

    const {cell: solve42Cell, dimension: solve42dimension} = solve(42);
    solve42Cell.x.toBe(232);
    solve42Cell.y.toBe(251);
    solve42dimension.toBe(12);
*/
    return fileAsText('day11/input.txt').then(input => {
        const gridSize = parseInt(input);
        const {cell, dimension} = solve(gridSize);
        return `${cell.x},${cell.y},${dimension}`.toBe("224,222,27");
    });
};

export function solve(gridSerial) {
    let highestCell = undefined;
    let highestTotal = 0;
    let highestDimension = 0;
    for(let dimension = 1; dimension <= 300; dimension++) {
        const {cell, total} = solve_a(gridSerial, dimension);
        if(total > highestTotal) {
            highestCell = cell;
            highestTotal = total;
            highestDimension = dimension;
        }
        showProgress(dimension);
    }
    return ({dimension: highestDimension, cell: highestCell });
}

function showProgress(progress) {
    const day11 = document.getElementsByTagName("day-11");
    if(day11) {
        day11[0].render(progress);
    }
}