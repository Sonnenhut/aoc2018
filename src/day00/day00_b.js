import {loadInputB} from '../common/inputs.js'
import {assertEquals} from "../common/assert.js";

export default class Day00_b {
    async solve() {
        this.solveIt('1212', 6);
        this.solveIt('1221', 0);
        this.solveIt('123425', 4);
        this.solveIt('123123', 12);
        this.solveIt('12131415', 4);
        return loadInputB('00').then(input => this.solveIt(input, 1278));
    }

    solveIt(input, expectedRes) {
        let result = 0;
        let howManyAhead = input.length / 2;
        for(let i=0; i < input.length; i++) {
            let nextIdx = (i + howManyAhead) % input.length;
            if(input.charAt(i) === input.charAt(nextIdx)) {
                result += parseInt(input.charAt(i));
            }
        }
        assertEquals(parseInt(result), parseInt(expectedRes));
        return result;
    }
}