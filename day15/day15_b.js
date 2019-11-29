import {fileAsText} from '../common/files.js'
import {outcome} from "./day15_a.js";

const EXAMPLE_29 =
    "#######\n" +
    "#.G...#\n" +
    "#...EG#\n" +
    "#.#.#G#\n" +
    "#..G#E#\n" +
    "#.....#\n" +
    "#######";

const EXAMPLE_33 =
    "#######\n" +
    "#E..EG#\n" +
    "#.#G.E#\n" +
    "#E.##E#\n" +
    "#G..#.#\n" +
    "#..E#.#\n" +
    "#######";

const EXAMPLE_37 =
     "#######\n" +
     "#E.G#.#\n" +
     "#.#G..#\n" +
     "#G.#.G#\n" +
     "#G..#.#\n" +
     "#...E.#\n" +
     "#######";

const EXAMPLE_39 =
    "#######\n" +
    "#.E...#\n" +
    "#.#..G#\n" +
    "#.###.#\n" +
    "#E#G#G#\n" +
    "#...#G#\n" +
    "#######";

const EXAMPLE_30 =
    "#########\n" +
    "#G......#\n" +
    "#.E.#...#\n" +
    "#..##..G#\n" +
    "#...##..#\n" +
    "#...#...#\n" +
    "#.G...G.#\n" +
    "#.....G.#\n" +
    "#########";

export default async function main() {
    outcome_part2(EXAMPLE_29).toBe([29,172]);
    outcome_part2(EXAMPLE_33).toBe([33,948]);
    outcome_part2(EXAMPLE_37).toBe([37,94]);
    outcome_part2(EXAMPLE_39).toBe([39,166]);
    outcome_part2(EXAMPLE_30).toBe([30,38]);
    return fileAsText('day15/input.txt').then(input => {
        let res = outcome_part2(input, 11 /*hard-coded to not take ages when loading the webpage*/);
        res.toBe([47,1022]);// 12ap
        return res[0] * res[1];
    });
};

function outcome_part2(input, startAp = 3) {
    let ap = startAp;
    let outcomeRes = {elveCasualties: true, rounds: 0};

    while(outcomeRes.elveCasualties) {
        ap++;
        outcomeRes = outcome(input, true, ap);
    }
    return [outcomeRes.rounds, outcomeRes.elveHp]
}