import {fileAsText} from '../common/files.js'

export const EXAMPLE_DAY  = "position=< 9,  1> velocity=< 0,  2>\n" +
    "position=< 7,  0> velocity=<-1,  0>\n" +
    "position=< 3, -2> velocity=<-1,  1>\n" +
    "position=< 6, 10> velocity=<-2, -1>\n" +
    "position=< 2, -4> velocity=< 2,  2>\n" +
    "position=<-6, 10> velocity=< 2, -2>\n" +
    "position=< 1,  8> velocity=< 1, -1>\n" +
    "position=< 1,  7> velocity=< 1,  0>\n" +
    "position=<-3, 11> velocity=< 1, -2>\n" +
    "position=< 7,  6> velocity=<-1, -1>\n" +
    "position=<-2,  3> velocity=< 1,  0>\n" +
    "position=<-4,  3> velocity=< 2,  0>\n" +
    "position=<10, -3> velocity=<-1,  1>\n" +
    "position=< 5, 11> velocity=< 1, -2>\n" +
    "position=< 4,  7> velocity=< 0, -1>\n" +
    "position=< 8, -2> velocity=< 0,  1>\n" +
    "position=<15,  0> velocity=<-2,  0>\n" +
    "position=< 1,  6> velocity=< 1,  0>\n" +
    "position=< 8,  9> velocity=< 0, -1>\n" +
    "position=< 3,  3> velocity=<-1,  1>\n" +
    "position=< 0,  5> velocity=< 0, -1>\n" +
    "position=<-2,  2> velocity=< 2,  0>\n" +
    "position=< 5, -2> velocity=< 1,  2>\n" +
    "position=< 1,  4> velocity=< 2,  1>\n" +
    "position=<-2,  7> velocity=< 2, -2>\n" +
    "position=< 3,  6> velocity=<-1, -1>\n" +
    "position=< 5,  0> velocity=< 1,  0>\n" +
    "position=<-6,  0> velocity=< 2,  0>\n" +
    "position=< 5,  9> velocity=< 1, -2>\n" +
    "position=<14,  7> velocity=<-2,  0>\n" +
    "position=<-3,  6> velocity=< 2, -1>";

export default async function main() {
    const coordsExample = parse(EXAMPLE_DAY);
    const [nextTo1, nextTo2] = parse("position=<1,  0> velocity=<0,  1>\nposition=<1,  1> velocity=< 0, 1>");
    nextTo1.isNextTo(nextTo2).toBe(true);
    nextTo1.isNextTo(nextTo2.tick()).toBe(false);
    nextTo1.tick().isNextTo(nextTo2.tick()).toBe(true);
    solve(coordsExample).iterations.toBe(3);
    return "GPEPPPEJ"; // shown in the rendered svg
};

var solve_store = new Map();

export function solve(coords) {
    let resCoord;
    let snapshots = [coords];
    let nearCoordCnt;
    let iterations = 0;
    do {
        coords = coords.map(coord => coord.tick());
        nearCoordCnt = countNearCoords(coords);
        // check what constellation has a high count of points next to each other
        if (nearCoordCnt > coords.length - (coords.length / 10)) {
            // this is a candidate
            resCoord = coords;
        }
        snapshots.push(coords);
        iterations++;
    } while (!resCoord);
    return ({coords: resCoord, iterations, snapshots});
}

function countNearCoords(coords) {
    const nextToCoords = coords.reduce((cnt, coord) => {
        return cnt + coords.filter(other => coord.isNextTo(other)).length;
    },0);
    // return half, when two are next to each other above code counts both of them
    return nextToCoords / 2;
}

export function parse(input) {
    return input.split(/\r?\n|\n/g).map(item => {
        //position=<-3,  6> velocity=< 2, -1>
        const [_, x,y,vx,vy] = /position=<(.*),(.*)> velocity=<(.*),(.*)>/.exec(item).map(item => parseInt(item));
        return new Coord(x,y,vx,vy);
    })
}

export class Coord {
    constructor(x,y,vx,vy) {
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
    }
    tick() {
        return new Coord(this.x + this.vx, this.y + this.vy, this.vx, this.vy);
    }
    // check if other is horizontally or vertically next to this (not diagonal)
    isNextTo(other) {
        const leftOrRight = (this.x === other.x - 1 || this.x === other.x + 1) && this.y === other.y;
        const upOrDown = (this.y === other.y - 1 || this.y === other.y + 1) && this.x === other.x;
        return leftOrRight || upOrDown;
    }
}
