import {fileAsText} from "../common/files.js";
import {Program} from "../day19/day19_a.js";

export default async function main() {
    return fileAsText('day21/input.txt').then(input => {
        let p = Program.ofInput(input);
        const candidate = () => p.r[4];
        let known = [];
        let newCandidateFound = true;
        do {
            p.tick();
            if(p.pointerValue === 28) { // whenever pgm checks if it should halt
                const anotherKnown = candidate();
                newCandidateFound = !known.includes(anotherKnown);
                if(newCandidateFound) {
                    known.push(anotherKnown);
                }
            }
        } while(newCandidateFound);
        let res = known.pop(); // last element before pgm is looping
        res.toBe(936387);
        return res;
    });
};