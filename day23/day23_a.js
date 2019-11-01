import {fileAsText} from "../common/files.js";

export default async function main() {

    let nbot = Nanobot.ofStr("pos=<1,2,3>, r=4");
    nbot._x.toBe(1);
    nbot._y.toBe(2);
    nbot._z.toBe(3);
    nbot._r.toBe(4);

    nbot = Nanobot.ofStr("pos=<0,0,0>, r=4");
    nbot.inRangeOf(Nanobot.ofStr("pos=<1,0,0>, r=1")).toBe(true);
    nbot.inRangeOf(Nanobot.ofStr("pos=<1,0,0>, r=1")).toBe(true);
    nbot.inRangeOf(Nanobot.ofStr("pos=<4,0,0>, r=3")).toBe(true);
    nbot.inRangeOf(Nanobot.ofStr("pos=<0,2,0>, r=1")).toBe(true);
    nbot.inRangeOf(Nanobot.ofStr("pos=<0,5,0>, r=3")).toBe(false);
    nbot.inRangeOf(Nanobot.ofStr("pos=<0,0,3>, r=1")).toBe(true);
    nbot.inRangeOf(Nanobot.ofStr("pos=<1,1,1>, r=1")).toBe(true);
    nbot.inRangeOf(Nanobot.ofStr("pos=<1,1,2>, r=1")).toBe(true);
    nbot.inRangeOf(Nanobot.ofStr("pos=<1,3,1>, r=1")).toBe(false);

    let nbots = [Nanobot.ofStr("pos=<0,0,0>, r=4"),
                    Nanobot.ofStr("pos=<1,0,0>, r=1"),
                    Nanobot.ofStr("pos=<4,0,0>, r=3"),
                    Nanobot.ofStr("pos=<0,2,0>, r=1"),
                    Nanobot.ofStr("pos=<0,5,0>, r=3"),
                    Nanobot.ofStr("pos=<0,0,3>, r=1"),
                    Nanobot.ofStr("pos=<1,1,1>, r=1"),
                    Nanobot.ofStr("pos=<1,1,2>, r=1"),
                    Nanobot.ofStr("pos=<1,3,1>, r=1")];
    withLargestR(nbots)._r.toBe(4);

    withLargestR(nbots).countInRange(nbots).toBe(7);
    return fileAsText('day23/input.txt').then(input => {
        nbots = input.split(/\r?\n|\n/g).map(s => Nanobot.ofStr(s));
        const res = withLargestR(nbots).countInRange(nbots);
        res.notToBe(995); // too high
        res.toBe(240);
        return res;
    });
};

function withLargestR(nbots) {
    return nbots.reduce((acc, curr) => acc._r > curr._r ? acc : curr, {_r:0})
}

class Nanobot {
    constructor(x,y,z,r) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._r = r;
    }
    static ofStr(str){
        const match = /pos=<([\-0-9]*),([\-0-9]*),([\-0-9]*)>, r=([\-0-9]*)/.exec(str);
        return new Nanobot(parseInt(match[1]),parseInt(match[2]),parseInt(match[3]),parseInt(match[4]));
    }

    inRangeOf(other) {
        let x,y,z;
        x=other._x - this._x;
        y=other._y - this._y;
        z=other._z - this._z;
        return Math.abs(x)+Math.abs(y)+Math.abs(z) <= this._r;
    }
    countInRange(others) {
        return others.reduce((acc, curr) => this.inRangeOf(curr) ? acc + 1 : acc , 0)
    }
}