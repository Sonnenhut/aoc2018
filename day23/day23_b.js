import {fileAsText} from "../common/files.js";
import {Nanobot} from "./day23_a.js";
import {PriorityQueue} from "../day20/PriorityQueue.js";

export default async function main() {
    let nbots = [
        Nanobot.ofStr("pos=<10,12,12>, r=2"),
        Nanobot.ofStr("pos=<12,14,12>, r=2"),
        Nanobot.ofStr("pos=<16,12,12>, r=4"),
        Nanobot.ofStr("pos=<14,14,14>, r=6"),
        Nanobot.ofStr("pos=<50,50,50>, r=200"),
        Nanobot.ofStr("pos=<10,10,10>, r=5")];

    let center = Nanobot.intersectingAll(nbots);
    center.countInRange(nbots).toBe(6);
    center.countIntersecting(nbots).toBe(6);

    center = new Nanobot(0,0,0,75);
    let splittedNanobots = center.split(center);
    center.countInRange(splittedNanobots).toBe(splittedNanobots.length);
    new Nanobot(0,0,0,6).intersecting(new Nanobot(3,0,0,6)).toBe(true);

    highestDensityDistance(nbots).toBe(36);

    return fileAsText('day23/input.txt').then(input => {
        nbots = input.split(/\r?\n|\n/g).map(s => Nanobot.ofStr(s));
        const res = highestDensityDistance(nbots);
        res.toBe(116547949);
        return res;
    });
};

function highestDensityDistance(rawNBots) {
    let center = Nanobot.intersectingAll(rawNBots);
    const withOrdinal = (rawNbot) => Object.assign(rawNbot, {ordinal: rawNbot.countIntersecting(rawNBots)});
    let queue = new PriorityQueue([withOrdinal(center)],node => node.ordinal, (left, right) => right - left);

    let csr = {r:-1};

    let loopCnt = 0;
    while(csr.r !== 1) {
        csr = queue.next();
        const splitted = csr.split().map(cube => withOrdinal(cube));
        queue.addAll(splitted);
        loopCnt++;
    }
    return csr.distanceToCenter;
}