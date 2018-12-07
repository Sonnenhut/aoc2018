import {fileAsText} from '../common/files.js'

export default async function main() {
    solve('Step B must be finished before step C can begin.\nStep A must be finished before step B can begin.').toBe('ABC');
    solve('Step C must be finished before step A can begin.\n' +
        'Step C must be finished before step F can begin.\n' +
        'Step A must be finished before step B can begin.\n' +
        'Step A must be finished before step D can begin.\n' +
        'Step B must be finished before step E can begin.\n' +
        'Step D must be finished before step E can begin.\n' +
        'Step F must be finished before step E can begin.').toBe('CABDFE');

    new Workers(0,0).workTimeForStep('A').toBe(1);
    new Workers(0,0).workTimeForStep('Z').toBe(26);
    new Workers(0,60).workTimeForStep('Z').toBe(86);

    return fileAsText('day07/input.txt').then(input => {
        return solve(input, 5, 60).notToBe('BVUHYE').notToBe('BETPLUFNGRJVADOHWMXKZQCISY').toBe('BETUFNVADWGPLRJOHMXKZQCISY');
    });
};

export function solve(input, workerCnt = 1, workTimeOffset = 0) {
    let stepOrder = input.split(/\r?\n|\n/g).map(text => ({step: /Step (.) must/.exec(text)[1], after: /step (.) can/.exec(text)[1]}));
    const instrChain = createInstructionChain(stepOrder);
    return new Workers(workerCnt, workTimeOffset).executeChain(instrChain, "");
}

class Workers {
    constructor(workerCnt, workTimeOffset) {
        this.workers = new Array(workerCnt);
        this.workTimeOffset = workTimeOffset;
    }
    workTimeForStep(step) {
        const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return this.workTimeOffset + abc.indexOf(step) + 1;
    }
    executeChain(nextIntructions, res) {
        if(nextIntructions.length === 0) {
            return res;
         } else {
            // unique/sort values
            nextIntructions = [... nextIntructions.reduce((acc, curr) => acc.add(curr), new Set())];
            nextIntructions.sort(compare_step);
            // look for the next one to execute
            for(let i=0; i < nextIntructions.length;i++) {
                const nextInstr = nextIntructions[i];
                if(res.includes(nextInstr.step)) {
                    // already executed
                    nextIntructions.push(...nextInstr.afterInstr);
                    nextIntructions.splice(i,1);
                    break;
                } else if(Instruction.canExecuteStep(nextInstr, nextIntructions)) {
                    nextIntructions.push(...nextInstr.afterInstr);
                    res += nextInstr.step;
                    nextIntructions.splice(i,1);
                    break;
                }
                // continue to look at the next instruction (maybe that one can be executed)
            }
            return this.executeChain(nextIntructions, res)
        }
    }
}
function createInstructionChain(stepOrders) {
    // merge steporders into Instruction (with step and after step)
    const mergedInstr = allStepNames(stepOrders).map(step => {
        return stepOrders.filter(stepOrder => stepOrder.step === step).reduce((instr, stepOrder) => instr.addStepAfter(stepOrder.after), new Instruction(step));
    });
    // chain the instructions
    const startingPoints = instructionEntryPoints(mergedInstr);
    chainInstructions([...mergedInstr], [...mergedInstr]);

    return startingPoints;
}

// recursive, iterate over all instructions and the "afterInstr" and see if "currInstr" can be subsituted there
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
    static canExecuteStep(instrToExecute, _otherInstructions) {
        // can execute step if no other instructions are pending with instrToExecute's step
        const otherInstructions = _otherInstructions.filter(other => other !== instrToExecute);
        const getAllInstr = function(instructions) {
            return instructions.reduce((acc, curr) => {
                acc.add(curr);
                getAllInstr(curr.afterInstr).forEach(item => acc.add(item));
                return acc;
            }, new Set());
        };
        const flattenedInstructions = [... getAllInstr(otherInstructions)];

        return flattenedInstructions.reduce((acc, other) => {
            return acc && other.step !== instrToExecute.step;
        }, true);
    }
}

function compare_step(a,b) {
    if (a.step < b.step)
        return -1;
    if (a.step > b.step)
        return 1;
    return 0;
}