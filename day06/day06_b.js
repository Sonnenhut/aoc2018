import {fileAsText} from '../common/files.js'
import {Coordinate, Distance, parseCoordinates} from './day06_a.js'

export default async function main() {
    const testCoords = parseCoordinates('1,1\n1,6\n8,3\n3,4\n5,5\n8,9');
    solve(testCoords,32).toBe(16);

    return fileAsText('day06/input.txt').then(input => {
        return solve(parseCoordinates(input),10000).toBe(46320);
    });
};

function solve(coordinates, manhattanDistanceSum) {
    // how big is our grid
    const maxX = coordinates.map(coord => coord.x).reduce((prev, curr) => prev > curr ? prev : curr);
    const maxY = coordinates.map(coord => coord.y).reduce((prev, curr) => prev > curr ? prev : curr);

    let res = 0;
    for(let x = 0; x <= maxX; x++) {
        for(let y = 0; y <= maxY; y++) {
            const distances = coordinates.map(coord => new Distance(new Coordinate(coord.id, x, y), new Coordinate(coord.id,coord.x - x, coord.y - y)));
            // add up all manhattan distances
            const totalManhattanDistance = distances.map(item => item.manhattanDistance).reduce((left,right) => left + right);
            if(totalManhattanDistance < manhattanDistanceSum) {
                res += 1;
            }
        }
    }
    return res;
}