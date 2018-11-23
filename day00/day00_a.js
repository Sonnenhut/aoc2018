import { fileAsText } from '../common/files.js'
import { toBe } from "../common/assert.js";
// some old aoc to see test my setup

export default class Day00_a {
    async solve() {
        this.solveIt('11 22', '3');
        this.solveIt('1111', '4');
        this.solveIt('1234', '0');
        this.solveIt('91212129', '9');
        return fileAsText('day00/input.txt').then(input => this.solveIt(input, '1253'));
    }

    solveIt(input, expectedRes) {
        let result = 0;
        for(let i=0; i < input.length; i++) {
            let nextIdx = i === input.length - 1 ? 0 : i+1;
            if(input.charAt(i) === input.charAt(nextIdx)) {
                result += parseInt(input.charAt(i));
            }
        }
        toBe(parseInt(result), parseInt(expectedRes));
        return result;
    }
}