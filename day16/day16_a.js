import {fileAsText} from '../common/files.js'


export default async function main() {
    Instr.ofStr("1 0 7 3")._state.toBe([1, 0,7,3]);

    Register.ofStr("Before: [1, 0, 7, 3]").r.toBe([1,0,7,3]);
    Register.ofStr("After:  [0, 1, 0, 2]").r.toBe([0,1,0,2]);

    // example
    Register.matchingFn(Register.of(3,2,1,1), Instr.of(9,2,1,2),Register.of(3,2,2,1)).toBe(['addi', 'mulr', 'seti']);

    return fileAsText('day16/input.txt').then(input => {
        return Sample.parseFirst(input)
            .map(sample => Register.matchingFn(sample.before, sample.instr, sample.after).length)
            .filter(i => i >= 3)
            .reduce((prev, _) => prev + 1,0)
    });
};

export class Register {
    static of(... arr) {
        let res = new Register();
        res.r = arr;
        return res;
    }
    static ofStr(str) {
        let numbers = (/\[([0-9, ]*)\]/g).exec(str)[1];
        let res = new Register();
        res.r = numbers.split(", ").map(v => parseInt(v));
        return res;
    }
    copy() {
        return Register.of(... this.r);
    }
    eq(other) {
        return this.r.toString() === other.r.toString(); // Really, javascript?!
    }

    add = (a,b) => a + b;
    addr = (a,b,c) => this.r[c] = this.add(this.r[a], this.r[b]);
    addi = (a,b,c) => this.r[c] = this.add(this.r[a], b);

    mul = (a,b) => a * b;
    mulr = (a,b,c) => this.r[c] = this.mul(this.r[a], this.r[b]);
    muli = (a,b,c) => this.r[c] = this.mul(this.r[a], b);

    ban = (a,b) => a & b;
    banr = (a,b,c) => this.r[c] = this.ban(this.r[a], this.r[b]);
    bani = (a,b,c) => this.r[c] = this.ban(this.r[a], b);

    bor = (a,b) => a | b;
    borr = (a,b,c) => this.r[c] = this.bor(this.r[a], this.r[b]);
    bori = (a,b,c) => this.r[c] = this.bor(this.r[a], b);

    setr = (a,b,c) => this.r[c] = this.r[a];
    seti = (a,b,c) => this.r[c] = a;

    gtir = (a,b,c) => this.r[c] = a > this.r[b] ? 1 : 0;
    gtri = (a,b,c) => this.r[c] = this.r[a] > b ? 1 : 0;
    gtrr = (a,b,c) => this.r[c] = this.r[a] > this.r[b] ? 1 : 0;

    eqir = (a,b,c) => this.r[c] = a === this.r[b] ? 1 : 0;
    eqri = (a,b,c) => this.r[c] = this.r[a] === b ? 1 : 0;
    eqrr = (a,b,c) => this.r[c] = this.r[a] === this.r[b] ? 1 : 0;

    static matchingFn(initial, instr, expected) {
        return Object.keys(initial)
            .filter(fn => fn.length === 4)
            //.forEach((it) => console.log(it))
            .reduce((prev, fn) => {
                let tmpReg = initial.copy();
                tmpReg[fn](instr.a, instr.b, instr.c);
                if(tmpReg.eq(expected)) {
                    prev.push(fn);
                }
                return prev;
            }, []);

    }
}
export class Instr {
    static of(... arr) {
        let res = new Instr();
        res._state = arr;
        return res;
    }

    static ofStr(txt) {
        let res = new Instr();
        res._state = txt.split(" ").map(v => parseInt(v));
        return res;
    }

    get op() {
        return this._state[0];
    }
    get a() {
        return this._state[1];
    }
    get b() {
        return this._state[2];
    }
    get c() {
        return this._state[3];
    }
}

export class Sample {
    static parseFirst(input) {
        // split where the program begins
        let lines = input.split(/\r?\n|\n/g);
        let res = [];
        //console.log(lines.length)

        for(let i = 0; i < lines.length; i++) {
            let before = lines[i];
            let instr = lines[i+1];
            let after = lines[i+2];
            //console.log(before, instr, after);
            if(before.indexOf("Before") >= 0 && after.indexOf("After") >= 0) {
                res.push(new Sample(Register.ofStr(before), Instr.ofStr(instr), Register.ofStr(after)));
            } else {
                break;
            }
            i += 3;
        }
        return res
    }
    static parseSecond(input) {
        // split where the program begins
        let lines = input.split(/\r?\n|\n/g);
        let res = [];
        //console.log(lines.length)

        for(let i = 0; i < lines.length; i++) {
            let before = lines[i];
            let instr = lines[i+1];
            let after = lines[i+2];
            //console.log(before, instr, after);
            if(before.indexOf("Before") >= 0 && after.indexOf("After") >= 0) {
                res.push(new Sample(Register.ofStr(before), Instr.ofStr(instr), Register.ofStr(after)));
            } else {
                break;
            }
            i += 3;
        }
        return res
    }

    constructor(before, instr, after) {
        this.before = before;
        this.instr = instr;
        this.after = after;
    }
}