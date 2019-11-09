import {fileAsText} from "../common/files.js";

export default async function main() {
    let nbot = Nanobot.ofStr("pos=<1,2,3>, r=4");
    nbot.x.toBe(1);
    nbot.y.toBe(2);
    nbot.z.toBe(3);
    nbot.r.toBe(4);

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

export function withLargestR(nbots) {
    return nbots.reduce((acc, curr) => acc._r > curr._r ? acc : curr, {_r:0})
}

export class Nanobot {
    constructor(x,y,z,r) {
        const round = (num) => num < 0 ? Math.floor(num) : Math.ceil(num);
        this._x = round(x);
        this._y = round(y);
        this._z = round(z);
        this._r = round(r);
    }
    static ofStr(str){
        const match = /pos=<([\-0-9]*),([\-0-9]*),([\-0-9]*)>, r=([\-0-9]*)/.exec(str);
        return new Nanobot(parseInt(match[1]),parseInt(match[2]),parseInt(match[3]),parseInt(match[4]));
    }
    static intersectingAll(others) {
        const maxx = others.reduce((acc,curr) => Math.abs(curr.x) > acc ? Math.abs(curr.x) : acc, 0);
        const maxy = others.reduce((acc,curr) => Math.abs(curr.y) > acc ? Math.abs(curr.y) : acc, 0);
        const maxz = others.reduce((acc,curr) => Math.abs(curr.z) > acc ? Math.abs(curr.z) : acc, 0);

        const r = maxx + maxy + maxz;
        return new Nanobot(0,0,0, r);
    }

    inRangeOf(other) {
        let x,y,z;
        x=other._x - this._x;
        y=other._y - this._y;
        z=other._z - this._z;
        return Math.abs(x)+Math.abs(y)+Math.abs(z) <= this._r;
    }

    intersecting(other) {
        return this.cornersIntersecting(other) || other.cornersIntersecting(this);
    }
    cornersIntersecting(other) {
        return this.corners().reduce((acc, corner) => {
            return acc || other.inRangeOf(corner); // test other, because the corner has no radius
        }, false);
    }

    corners() {
        if(this.r === 1) {
            return [this];
        } else {
            return this.unfold(0, this.r / 3/* go into each corner*/)
        }
    }
    split() {
        const newRadius = this.r / 2; /* half the radius */
        const delta = newRadius / 3; /* each of the three dimensions gets equal space */
        // halving the radius - then we can split into 8 parts that, together, take up the same space - split
        return this.unfold(newRadius, delta)
    }
    unfold(newR, delta) { // unfold into 8 parts
        let res = [];
        // upper 4 according to y axis
        res.push(new Nanobot(this.x - delta, this.y - delta, this.z - delta, newR));
        res.push(new Nanobot(this.x + delta, this.y - delta, this.z - delta, newR));
        res.push(new Nanobot(this.x - delta, this.y - delta, this.z + delta, newR));
        res.push(new Nanobot(this.x + delta, this.y - delta, this.z + delta, newR));
        // lower 4 according to y axis
        res.push(new Nanobot(this.x - delta, this.y + delta, this.z - delta, newR));
        res.push(new Nanobot(this.x + delta, this.y + delta, this.z - delta, newR));
        res.push(new Nanobot(this.x - delta, this.y + delta, this.z + delta, newR));
        res.push(new Nanobot(this.x + delta, this.y + delta, this.z + delta, newR));
        return res;
    }
    countInRange(others) {
        return others.reduce((acc, curr) => this.inRangeOf(curr) ? acc + 1 : acc , 0)
    }
    countIntersecting(others) {
        return others.reduce((acc, other) => this.intersecting(other) ? acc + 1 : acc , 0)
    }
    get distanceToCenter() {return this.x + this.y + this.z}
    get x() { return this._x; }
    get y() { return this._y; }
    get z() { return this._z; }
    get r() { return this._r; }
}