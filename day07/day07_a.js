import {fileAsText} from '../common/files.js'

export const GENERIC_EXAMPLE = 'Step B must be finished before step C can begin.\nStep A must be finished before step B can begin.';
export const DAY_EXAMPLE = 'Step C must be finished before step A can begin.\n' +
    'Step C must be finished before step F can begin.\n' +
    'Step A must be finished before step B can begin.\n' +
    'Step A must be finished before step D can begin.\n' +
    'Step B must be finished before step E can begin.\n' +
    'Step D must be finished before step E can begin.\n' +
    'Step F must be finished before step E can begin.';

export default async function main() {
    solve_a(GENERIC_EXAMPLE).toBe('ABC');
    solve_a(DAY_EXAMPLE).toBe('CABDFE');

    return fileAsText('day07/input.txt').then(input => {
        return solve_a(input, 1, 0) //
            .notToBe('BVUHYE') //
            .notToBe('BETPLUFNGRJVADOHWMXKZQCISY') //
            .toBe('BETUFNVADWGPLRJOHMXKZQCISY');
    });
};

export function solve_a(input) {
    let stepOrder = input.split(/\r?\n|\n/g).map(text => ({step: /Step (.) must/.exec(text)[1], after: /step (.) can/.exec(text)[1]}));
    const instrChain = createInstructionChain(stepOrder);
    return new SharedWork().executeChain(instrChain, "");
}

export class SharedWork {
    constructor(workerCnt = 1, workTimeOffset = 0) {
        this.maxWorkerCnt = workerCnt;
        this.workers = [];
        this.workTimeOffset = workTimeOffset;
        this.elapsedTime = 0;
    }
    workTimeForStep(step) {
        const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return this.workTimeOffset + abc.indexOf(step) + 1;
    }
    executeChain(nextIntructions) {
        let res = "";
        nextIntructions.sort(compare_step);
        while(nextIntructions.length > 0 || this.workers.length !== 0) {
            const nextInstrToExecute = this.findNextExecutable(nextIntructions);
            if(this.areWorkersFree() && nextInstrToExecute) {
                // lets do some work and remove the instr from the array
                this.scheduleWorker(nextInstrToExecute);
                nextIntructions = nextIntructions.filter(other => other !== nextInstrToExecute);
            } else {
                const finishedInstructions = this.tickUntilFirstWorkerFinished();
                // finish the instructions and add their work to the result
                finishedInstructions.forEach(instr => nextIntructions.push(... instr.afterInstr));
                finishedInstructions.forEach(instr => res += instr.step);
                // unique/sort values after adding some
                nextIntructions = withoutDuplicates(nextIntructions);
                nextIntructions.sort(compare_step);
            }
        }
        return res;
    }
    findNextExecutable(nextInstructions) {
        let res;
        const workload = [... nextInstructions, ... this.workers.map(worker => worker.instruction)];
        // look for the next one to execute
        for (let i = 0; i < nextInstructions.length; i++) {
            const nextInstr = nextInstructions[i];
            if (Instruction.canExecuteStep(nextInstr, workload)) {
                res = nextInstr;
                break;
            }
        }
        return res;
    }
    areWorkersFree() {
        return this.workers.length !== this.maxWorkerCnt;
    }
    tickUntilFirstWorkerFinished() {
        // tick the time of the worker that has the least work to do
        const lowestTimeRemaining = this.workers.reduce((lowest, curr) => lowest < curr.timeRemaining ? lowest : curr.timeRemaining, 999);
        this.workers.forEach(worker => worker.timePassed(lowestTimeRemaining));
        this.elapsedTime += lowestTimeRemaining;
        // check for all workers who are now finished!
        const finishedWorkers = this.workers.filter(worker => worker.isFinished());
        this.workers = this.workers.filter(worker => !finishedWorkers.includes(worker)); // remove finished workers
        return finishedWorkers.map(worker => worker.getInstruction());
    }
    scheduleWorker(instr) {
        const workTime = this.workTimeForStep(instr.step);
        this.workers.push(new Worker(workTime, instr));
    }
    getElapsedTime() {
        return this.elapsedTime;
    }
}

class Worker {
    constructor(workTime, instruction) {
        this.timeRemaining = workTime;
        this.instruction = instruction;
    }
    timePassed(time) {
        this.timeRemaining -= time;
    }
    isFinished() {
        return this.timeRemaining <= 0;
    }
    getInstruction() {
        return this.instruction;
    }
}

export function createInstructionChain(stepOrders) {
    // merge steporders into Instruction (with step and after step)
    const mergedInstr = allStepNames(stepOrders).map(step => {
        return stepOrders.filter(stepOrder => stepOrder.step === step).reduce((instr, stepOrder) => instr.addStepAfter(stepOrder.after), new Instruction(step));
    });
    // chain the instructions
    const startingPoints = instructionEntryPoints(mergedInstr);
    chainInstructions([...mergedInstr], [...mergedInstr]);

    return startingPoints;
}

// recursive, iterate over all instructions and the "afterInstr" and see if "currInstr" can be substituted there
function chainInstructions(allInstr, toLookAt) {
    if(!toLookAt || toLookAt.length === 0) {
        return;
    }
    const compare = toLookAt[0];
    for(let other of allInstr) {
        if(other.needsInstrForStep(compare.step)) {
            other.addAfterInstr(compare);
        }
    }
    toLookAt.splice(0,1);
    chainInstructions(allInstr, toLookAt);
}

function allStepNames(stepOrders) {
    return [...stepOrders.reduce((set, curr) => set.add(curr.step).add(curr.after), new Set())]
}

function instructionEntryPoints(instructions) {
    return instructions.filter(instr => {
        // find the instruction that is no-ones "after" step
        const stepsWithCurrentAsAfter = instructions.filter(otherInstr => otherInstr.afterStep.includes(instr.step));
        return stepsWithCurrentAsAfter.length === 0;
    });//
}

class Instruction {
    constructor(step) {
        this.afterStep = [];
        this.afterInstr = [];
        this.step = step;
    }
    addStepAfter(after) {
        this.afterStep.push(after);
        return this;
    }
    needsInstrForStep(step) {
        return this.afterStep.includes(step) && this.afterInstr.filter(instr => instr.step === step).length === 0;

    }
    addAfterInstr(instr) {
        this.afterInstr.push(instr);
        // re-sort
        this.afterInstr.sort(compare_step);
    }
    static flatInstructions(instructions) {
        const set = instructions.reduce((acc, curr) => {
            acc.add(curr);
            Instruction.flatInstructions(curr.afterInstr).forEach(item => acc.add(item));
            return acc;
        }, new Set());
        return [... set];
    }
    static canExecuteStep(instrToExecute, _otherInstructions) {
        // can execute step if no other instructions are pending with instrToExecute's step
        const otherInstructions = _otherInstructions.filter(other => other !== instrToExecute);
        const flattenedInstructions = Instruction.flatInstructions(otherInstructions);

        return flattenedInstructions.reduce((acc, other) => {
            return acc && other.step !== instrToExecute.step;
        }, true);
    }
}

function withoutDuplicates(arr) {
    return [...arr.reduce((acc, curr) => acc.add(curr), new Set())];
}

function compare_step(a,b) {
    if (a.step < b.step)
        return -1;
    if (a.step > b.step)
        return 1;
    return 0;
}