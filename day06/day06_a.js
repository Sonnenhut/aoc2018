import {fileAsText} from '../common/files.js'

export default async function main() {
    const testCoords = parseCoordinates('1,1\n1,6\n8,3\n3,4\n5,5\n8,9');
    solve(testCoords).toBe(17);

    return fileAsText('day06/input.txt').then(input => {
        return solve(parseCoordinates(input)).toBe(6047);
    });
};

export function solve(coordinates) {
    return new Grid(calcAllManhattanDistances(coordinates)).largestArea();
}

export function parseCoordinates(text) {
    return text.split(/\r?\n|\n/g).map((row, idx) => {
        const split = row.split(',');
        return new Coordinate(idx,parseInt(split[0]),parseInt(split[1].trim()));
    })
}

function calcAllManhattanDistances(coordinates) {
    // how big is our grid
    const maxX = coordinates.map(coord => coord.x).reduce((prev, curr) => prev > curr ? prev : curr);
    const maxY = coordinates.map(coord => coord.y).reduce((prev, curr) => prev > curr ? prev : curr);

    // calculate the shortest manhattan distances for every point in the grid
    let res = [];

    for(let x = 0; x <= maxX; x++) {
        for(let y = 0; y <= maxY; y++) {
            const distances = coordinates.map(coord => new Distance(new Coordinate(coord.id, x, y), new Coordinate(coord.id,coord.x - x, coord.y - y)));
            // only remember the shortest ones
            const shortestManhattanDistance = distances.map(item => item.manhattanDistance).reduce((left,right) => {
                return left < right ? left : right;
            });
            const shortestDistances = distances.filter(item => item.manhattanDistance === shortestManhattanDistance);
            if(shortestDistances.length === 1) {
                res.push(shortestDistances[0]);
            }
        }
    }
    return res;
}

export class Grid {
    constructor(distances) {
        this.distances = distances;
        this.maxX = distances.map(dist => dist. location.x).reduce((prev, curr) => prev > curr ? prev : curr);
        this.maxY = distances.map(dist => dist.location.y).reduce((prev, curr) => prev > curr ? prev : curr);
    }

    largestArea() {
        // group them by id
        const allIds = new Set([...this.distances.map(item => item.location.id)]);
        const shortestDistancesNotInfinite = [...allIds].reduce((arr,id) => {
            // count the distances for one ID
            const sameIdDistance = this.distances.filter(distance => distance.location.id === id);
            // only valid when no location is at the edge of our grid
            const invalidDistances = sameIdDistance.filter(distance => {
                const x = distance.location.x;
                const y = distance.location.y;
                return x === this.maxX || y === this.maxY || x === 0 || y === 0;
            });
            if(invalidDistances.length === 0) {
                arr.push([id, sameIdDistance.length]);
            }
            return arr;
        },[]).sort((left, right) => left[1] - right[1]).reverse()[0];
        return shortestDistancesNotInfinite[1];
    }
}

export class Distance {
    constructor(location, destination) {
        this.location = location;
        this.manhattanDistance = Math.abs(destination.x) + Math.abs(destination.y);
    }
}
export class Coordinate{
    constructor(id,x,y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}