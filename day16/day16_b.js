import {fileAsText} from '../common/files.js'
import {Sample, Register} from './day16_a.js';

export default async function main() {

    return fileAsText('day16/input.txt').then(input => {
       /* return Sample.parseFirst(input)
            .forEach(sample => {
                let matchingFn = Register.matchingFn(sample.before, sample.instr, sample.after);
                if(matchingFn.length === 1) {
                    console.log("found opcode for function",sample.instr.op,matchingFn[0]);
                }
            });
            //.filter(i => i === 1)
            //.reduce((prev, _) => prev + 1,0)

        */
    });
};

export function solve(ripeness) {
}
