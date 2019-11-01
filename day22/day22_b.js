import {fileAsText} from "../common/files.js";
import {Cave, NARROW, ROCKY, WET} from "./day22_a.js";

export default async function main() {
    let cave = new Cave(510, {x:10,y:10}, {x:20,y:20});

    let dij = new Dijkstra(cave.regions, cave.regionAt(0,0), cave.regionAt(10,10));
    let distanceToTarget = dij.distanceToTarget();
    distanceToTarget.toBe(45);

    return fileAsText('day22/input.txt').then(input => {
        const depth = parseInt(/depth: ([0-9]*)/.exec(input)[1]);
        const targetMatch = /target: ([0-9]*),([0-9]*)/.exec(input);
        const target = {
            x: parseInt(targetMatch[1]),
            y: parseInt(targetMatch[2])
        };
        const buffer = 40;// make the cave bigger to allow going beyond the target
        cave = new Cave(depth, target, {x: target.x + buffer, y: target.y + buffer});

        dij = new Dijkstra(cave.regions, cave.regionAt(0,0), cave.regionAt(target.x,target.y));
        const res = dij.distanceToTarget();

        res.notToBe(36); // would be to the example target... duh {x:10, y:10}
        res.notToBe(1046); // too high
        res.notToBe(976); // too low
        res.notToBe(1007); // ???
        res.notToBe(989); // ???
        res.notToBe(984); // ???
        res.toBe(986);
        return res;
    });
};

const INFINITE = Number.MAX_SAFE_INTEGER;
const CLIMBING = 'climbing';
const TORCH = 'torch';
const NEITHER = 'neither';
const possibleGear = new Map();
possibleGear.set(ROCKY, [CLIMBING, TORCH]);
possibleGear.set(WET, [CLIMBING, NEITHER]);
possibleGear.set(NARROW, [TORCH, NEITHER]);

class Dijkstra {
    constructor(nodes = [], startNode, targetNode) {
        // --- INIT nodes
        this._nodes = nodes.filter(node => node !== startNode && node !== targetNode);
        this._nodes = this._nodes.flatMap(node => {// fan out node for each possible gear type
            return possibleGear.get(node.type).map(gear => Object.assign({withGear: gear}, node));
        });
        this._startNode = Object.assign({withGear: TORCH}, startNode);
        this._targetNode = Object.assign({withGear: TORCH}, targetNode);
        this._nodes.push(this._startNode, this._targetNode);

        this._queue = new Queue([... this._nodes]);
        this._nodes.forEach(node => {
            node.distance = INFINITE;
            node.predecessor = null;
        });
        this._startNode.distance = 0;
        this._nodeLookup = Dijkstra._createNodeLookup(this._nodes);

        this._calcPredecessors()
    }
    distanceToTarget() {
        return this._targetNode.distance;
    }

    _calcPredecessors() {
        while(this._queue.length) {
            let u = this._queue.next();
            this._queue.remove(u);
            if(u === this._targetNode) {
                break;
            }
            this._neighbors(u).forEach(v => {
                if(this._queue.includes(v)) {
                    Dijkstra._updateDistance(u,v);
                }
            });
        }
    }

    _neighbors(u) {
        const keyOf = (x, y) => `${x}_${y}`;
        let right = this._nodeLookup.get(keyOf(u.x + 1, u.y)) || [];
        let left = this._nodeLookup.get(keyOf(u.x - 1, u.y)) || [];
        let bottom = this._nodeLookup.get(keyOf(u.x, u.y + 1)) || [];
        let top = this._nodeLookup.get(keyOf(u.x, u.y - 1)) || [];

        let res = [...right, ...left, ...bottom, ...top];
        // only neighbors to which we can switch to... without falling
        let possibleGears = possibleGear.get(u.type);
        return res.filter(other => possibleGears.includes(other.withGear));
    }

    static _updateDistance(u, v) {
        let alt = u.distance + Dijkstra._distanceBetween(u,v);
        if(alt < v.distance) {
            v.distance = alt;
            v.predecessor = u;
        }
    }
    static _distanceBetween(u, v) {
        let res = 1;
        if(u.withGear !== v.withGear) {
            res += 7; // switch gear
        }
        return res;
    }
    static _createNodeLookup(nodes) {
        // lookup for neighbors
        return nodes.reduce((acc, curr) => {
            const key = `${curr.x}_${curr.y}`;
            if(acc.get(key)) {
                acc.get(key).push(curr);
            } else {
                acc.set(key, [curr]);
            }
            return acc
        },new Map());
    }
}

// queue for poor people...
class Queue {
    constructor(nodes) {
        this._nodes = new Map();
        nodes.forEach(node => {
            this._nodes.set(Queue._nodeKey(node), node);
        })
    }
    includes(node) {
        return !!this._nodes.get(Queue._nodeKey(node));
    }
    get length() {
        return this._nodes.size;
    }

    next() {// with lowest distance
        // without a priority queue, this is a performance bottleneck
        let acc = {distance: INFINITE};
        for(let node of this._nodes.values()) {
            acc = node.distance < acc.distance ? node : acc;
        }
        return acc;
    }
    remove(toRemove) {
        this._nodes.delete(Queue._nodeKey(toRemove));
    }
    static _nodeKey(node) {
        return node.withGear + "_" + node.x + "_" + node.y;
    }
}