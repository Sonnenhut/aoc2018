import { fileAsText } from '../common/files.js'
export const ROCKY = ".";
export const WET = "=";
export const NARROW = "|";

const riskLevels = new Map();
riskLevels.set(ROCKY, 0);
riskLevels.set(WET, 1);
riskLevels.set(NARROW, 2);

export default async function main() {
    Region._calcErosionLvl(0,510).toBe(510);
    let cave = new Cave(510, {x:10,y:10});

    let region = cave.regionAt(0,0);
    region.geoIdx.toBe(0);
    region.erosionLvl.toBe(510);
    region.type.toBe(ROCKY);

    region = cave.regionAt(1,0);
    region.geoIdx.toBe(16807);
    region.erosionLvl.toBe(17317);
    region.type.toBe(WET);

    region = cave.regionAt(1,1);
    region.geoIdx.toBe(145722555);
    region.erosionLvl.toBe(1805);
    region.type.toBe(NARROW);

    region = cave.regionAt(10,10);
    region.geoIdx.toBe(0);
    region.erosionLvl.toBe(510);
    region.type.toBe(ROCKY);

    cave.summedRiskLvl.toBe(114);
    return fileAsText('day22/input.txt').then(input => {
        const depth = parseInt(/depth: ([0-9]*)/.exec(input)[1]);
        const targetMatch = /target: ([0-9]*),([0-9]*)/.exec(input);
        const target = {
            x: parseInt(targetMatch[1]),
            y: parseInt(targetMatch[2])
        };
        cave = new Cave(depth, target);
        let res = cave.summedRiskLvl;
        res.notToBe(5839); // too high
        res.toBe(5786);
        return res;
    });
};

export class Cave {
    constructor(depth, targetCoords, rectangleBounds = targetCoords) {
        this.depth = depth;
        this.targetCoords = Object.assign({}, targetCoords);
        this.regions = [];
        this._generateRectangle(rectangleBounds.x, rectangleBounds.y)
    }
    _generateRectangle(destX, destY) {
        for (let y = 0; y <= destY; y++) {
            for (let x = 0; x <= destX; x++) {
                let geoIdx = this._calcGeoIdx(x, y);
                this.regions.push(new Region(x, y, geoIdx, this.depth));
            }
        }
    }
    regionAt(x,y) {
        let res = null;
        let filtered = this.regions.filter((region) => region.x === x && region.y === y);
        if(filtered.length) {
            res = filtered[0];
        }
        return res;
    }
    get summedRiskLvl() {
        return this.regions.reduce((acc, curr) => {
           return acc + curr.riskLvl;
        },0)
    }
    _calcGeoIdx(x,y) {
        let res;
        if(x === 0 && y === 0) {
            res = 0;
        } else if(this.targetCoords.x === x && this.targetCoords.y === y) {
            res = 0;
        } else if(y === 0) {
            res = x * 16807;
        } else if(x === 0) {
            res = y * 48271;
        } else {
            res = this.regionAt(x-1,y).erosionLvl * this.regionAt(x,y-1).erosionLvl;
        }
        return res;
    }
}

export class Region {
    constructor(x,y,geoIdx, depth) {
        this.x=x;
        this.y=y;
        this.geoIdx = geoIdx;
        this.erosionLvl = Region._calcErosionLvl(geoIdx, depth);
        this.type = Region._calcType(this.erosionLvl);
        this.riskLvl = riskLevels.get(this.type);
    }
    static _calcType(erosionLvl) {
        let res;
        if(erosionLvl % 3 === 0) {
            res = ROCKY;
        } else if(erosionLvl % 3 === 1) {
            res = WET;
        } else if(erosionLvl % 3 === 2) {
            res = NARROW;
        }
        return res;
    }
    static _calcErosionLvl(geoIdx, depth) {
        return (geoIdx + depth) % 20183;
    }
}