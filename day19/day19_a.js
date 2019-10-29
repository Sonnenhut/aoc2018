import { fileAsText } from '../common/files.js'
import { Instr } from "../day16/day16_a.js";
import {Register} from "../day16/day16_a.js";

const EXAMPLE = `#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`;

export default async function main() {
    const {pointer, instructions} = readInput(EXAMPLE);
    pointer.toBe(0);
    instructions[0].op.toBe('seti');
    instructions[0].a.toBe(5);
    instructions[0].b.toBe(0);
    instructions[0].c.toBe(1);
    instructions[6].op.toBe('seti');
    instructions[6].a.toBe(9);
    instructions[6].b.toBe(0);
    instructions[6].c.toBe(5);

    let p = Program.ofInput(EXAMPLE);
    p.pointer = 0;
    p.tick();
    p.r.toBe([1, 5, 0, 0, 0, 0]);
    p.pointer = 0;
    p.tick();
    p.r.toBe([2, 5, 6, 0, 0, 0]);
    p.tick();
    p.r.toBe([4, 5, 6, 0, 0, 0]);
    p.tick();
    p.r.toBe([6, 5, 6, 0, 0, 0]);
    p.tick();
    p.r.toBe([7, 5, 6, 0, 0, 9]);

    p = Program.ofInput(EXAMPLE);
    while(p.tick()){}
    p.pointerValue.toBe(7);

    return fileAsText('day19/input.txt').then(input => {
        p = Program.ofInput(input);
        while(p.tick()){}
        let res = p.r[0];
        res.notToBe(257); // too low
        return res;
    });
};

export class Program {
    static ofInput(input) {
        const {pointer, instructions} = readInput(input);
        return new Program(pointer, instructions)
    }
    constructor(pointer, instructions) {
        this.pointer = pointer;
        this.instr = instructions;
        this.register = Register.of(0,0,0,0,0,0);
    }
    get r() {
        return this.register.r;
    }
    get pointerValue() {
        return this.register.r[this.pointer];
    }
    get currInstr() {
        return this.instr[this.pointerValue];
    }
    incPointerValue() {
        this.register.r[this.pointer] += 1;
    }
    tick() {
        let res = true;

        const instr = this.currInstr;
        if(instr) {
            this.register[instr.op](instr.a, instr.b, instr.c);
            // increment pointer/register value
            this.incPointerValue();
        } else {
            // outside range, cannot execute anymore
            res = false
        }
        return res;
    }
}


function readInput(input) {
    // split where the program begins
    const lines = input.split(/\r?\n|\n/g);
    const instructions = lines.slice(1)
        .map(str => Instr.ofStr(str));
    const pointer = parseInt(input.match(/^#ip ([0-9])/)[1]);
    return { pointer, instructions };
}