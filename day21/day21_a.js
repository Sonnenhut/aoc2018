import { fileAsText } from '../common/files.js'
import {Program} from "../day19/day19_a.js";

export default async function main() {
    return fileAsText('day21/input.txt').then(input => {
        let p = Program.ofInput(input);
        let currInstr = p.currInstr;
        do {
            // run until we hit the first check for pgm halt
            p.tick();
            currInstr = p.currInstr;
        } while(p.pointerValue !== 28);
        let res = p.r[4]; // what is in register 0 ?!
        res.notToBe(0); // duh
        res.toBe(15690445);
        return res;
    });
};

