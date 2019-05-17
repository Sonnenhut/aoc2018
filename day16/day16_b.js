import {fileAsText} from '../common/files.js'
import {Instr,Sample, Register} from './day16_a.js';

export default async function main() {

    return fileAsText('day16/input.txt').then(input => {
        return solve(input)
    });
};

export function solve(input) {
    const opCodeFns = findOpCodeFunctions(input);
    console.log('opcodes',opCodeFns);
    const instr = readTestInstructions(input);

    // run opcode/fn in register
    const reg = Register.of(0,0,0,0);
    instr.forEach(instr => {
        const fn = opCodeFns.get(instr.op);
        console.log(fn, 'on', instr);
        reg[fn](instr.a, instr.b, instr.c);
    });
    return reg.r[0];
}

function findOpCodeFunctions(input) {
    let res = new Map();
    const possibleFns = Sample.parseFirst(input)
        .reduce((prev, sample) => {
            let matchingFn = Register.matchingFn(sample.before, sample.instr, sample.after);
            prev.push({op: sample.instr.op, fns: matchingFn});
            return prev;
        }, []);
    do {
        const found = possibleFns.filter(entry => res.get(entry.op) === undefined) // not already found
            .filter(entry => entry.fns.length === 1)[0];

        const fnsName = found.fns[0];
        res.set(found.op, fnsName);

        // remove already identified opCode from possible matches
        possibleFns.forEach(entry => {
            entry.fns = without(entry.fns, fnsName);
        })

    } while (res.size !== 16);
    return res;
}


function readTestInstructions(input) {
    // split where the program begins
    let lines = input.split(/\r?\n|\n/g);
    const startLineNo = findProgramLine(lines);
    return lines.slice(startLineNo)
        .map(str => Instr.ofStr(str))
}

function findProgramLine(lines) {let lineCnt = 0;
    let emptyLineCnt = 0;
    let skip = true;

    // find three empty lines
    do {
        if(lines[lineCnt].trim() === "") {
            emptyLineCnt++;
        } else {
            emptyLineCnt = 0;
        }
        if(emptyLineCnt === 3) {
            skip = false;
        }
        lineCnt++;
    } while (skip);
    return lineCnt + 1;
}

function without(arr, toRemove) {
    return arr.filter(item => item !== toRemove);
}