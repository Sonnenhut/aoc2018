import {fileAsText} from '../common/files.js'
import {SharedWork, createInstructionChain, GENERIC_EXAMPLE, DAY_EXAMPLE} from './day07_a.js'

export default async function main() {
    solve_b(DAY_EXAMPLE,2,0).toBe(15);

    new SharedWork(0,0).workTimeForStep('A').toBe(1);
    new SharedWork(0,0).workTimeForStep('C').toBe(3);
    new SharedWork(0,0).workTimeForStep('Z').toBe(26);
    new SharedWork(0,60).workTimeForStep('A').toBe(61);
    new SharedWork(0,60).workTimeForStep('Z').toBe(86);

    return fileAsText('day07/input.txt').then(input => {
        return solve_b(input, 5, 60)
            .notToBe(799) // too low
            .notToBe(800) // too low
            .notToBe(1016) // too high
            .notToBe(950) // was just a guess.. kind of desperate
            .toBe(848)
        ;
    });
};

export function solve_b(input, workerCnt = 1, workTimeOffset = 0) {
    let stepOrder = input.split(/\r?\n|\n/g).map(text => ({step: /Step (.) must/.exec(text)[1], after: /step (.) can/.exec(text)[1]}));
    const instrChain = createInstructionChain(stepOrder);
    const sharedWork = new SharedWork(workerCnt, workTimeOffset);
    sharedWork.executeChain(instrChain);
    return sharedWork.getElapsedTime();
}