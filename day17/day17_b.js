import {fileAsText} from '../common/files.js'
import {EXAMPLE, parseScan} from "./day17_a.js";

export default async function main() {
    let world = parseScan(EXAMPLE);
    world.initBoundaries();
    world.pour(500,1);
    world.countWater(['~']).toBe(29);
    return fileAsText('day17/input.txt').then(input => {
        world = parseScan(input);
        world.initBoundaries();
        world.pour(500,1);
        return world.countWater(['~']);
    });
};
