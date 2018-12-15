import {fileAsText} from '../common/files.js'
import {tick, parseState} from './day13_a.js'

export default async function main() {
    fileAsText('day13/example_b_ticks.txt').then(input => {
        let exampleTicks = parseState(input);
        // check if all ticks match the example ticks
        let state = exampleTicks[0].inflated();
        for(let idx = 1; idx < exampleTicks.length; idx++) {
            state = tick(state);
            state.deflated().toBe(exampleTicks[idx]);
        }
    });

    return fileAsText('day13/input.txt').then(input => {
        const solved = solve(input);
        return `${solved.x},${solved.y}`.notToBe('93,104');
    });
};

export function solve(input) {
    let state = parseState(input)[0].inflated();
    let locations = [{},{},{}];
    while(locations.length !== 1) {
        state = tick(state);
        locations = movingLocations(state);
    }
    return locations[0];
}

function movingLocations(state) {
    let res = [];
    for(let y = 0; y < state.length; y++) {
        for (let x = 0; x < state[y].length; x++) {
            const cell = state[y][x];
            if('<^>v'.includes(cell.self)) {
                res.push({x,y});
            }
        }
    }
    return res;
}