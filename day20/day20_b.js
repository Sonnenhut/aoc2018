import {fileAsText} from "../common/files.js";
import {Area, Dijkstra} from "./day20_a.js";

export default async function main() {
    return fileAsText('day20/input.txt').then(input => {
        let res = solveB(input);
        res.toBe(8545);
        return res;
    });
};

export function solveB(input) {
    let area = new Area(input);
    let dijk = new Dijkstra(area.nodes, area.root);
    let allNodes = dijk.run();

    return allNodes.map(node => node.distance).reduce((acc, distance) => distance >= 1000 ? acc + 1 : acc,0)
}