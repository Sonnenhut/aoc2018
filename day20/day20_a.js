import {fileAsText} from '../common/files.js'
import {PriorityQueue} from "./PriorityQueue.js";

export const EXAMPLE = `^ENWWW(NEEE|SSE(EE|N))$`;
export const EXAMPLE_31 = "^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$";
export const EXAMPLE_23 = "^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$";
export const EXAMPLE_18 = "^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$";
export const EXAMPLE_10 = "^ENWWW(NEEE|SSE(EE|N))$";

export default async function main() {
    Area.branches(EXAMPLE,6).toBe(['NEEE','SSE(EE|N)']);
    Area.branches(EXAMPLE,15).toBe(['EE','N']);
    Area.branches(EXAMPLE_31,12).toBe(['S','NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS)))']);
    Area.branches(EXAMPLE_18,8).toBe(['NEWS','']);

    Area.calcCursorOffset(['NEEE','SSE(EE|N)']).toBe(16);
    Area.calcCursorOffset(['S','NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS)))']).toBe(52);

    solveA(EXAMPLE).toBe(10);
    solveA(EXAMPLE_31).toBe(31);
    solveA(EXAMPLE_23).toBe(23);
    solveA(EXAMPLE_10).toBe(10);
    solveA(EXAMPLE_18).toBe(18);

    return fileAsText('day20/input.txt').then(input => {
        const res = solveA(input);
        res.notToBe(9007199254740991); // too high
        res.toBe(3046);
        return res;
    });
};

export function solveA(input) {
    let area = new Area(input);
    let dijk = new Dijkstra(area.nodes, area.root);
    let allNodes = dijk.run();

    return allNodes.map(node => node.distance).reduce((acc, curr) => Math.max(acc, curr),0)
}

export class Area {
    constructor(input) {
        this.nodeMap = new Map();
        this.root = {x:0, y:0, next:[]};
        this.nodeMap.set(Area._nodeKey(this.root), this.root);
        this.parse(input, [this.root])
    }
    get nodes() {
        return [...this.nodeMap.values()]
    }

    parse(input, startNodes = [{x:0, y:0}]) {
        let csr = 0;
        let nodes = startNodes;
        while (csr < input.length) {
            const direction = input.charAt(csr);
            if (['N', 'S', 'W', 'E'].includes(direction)) {
                nodes = nodes.map(node => this.newNode(node, direction));
            } else if('(' === direction) {
                // parse branches
                const arr = Area.branches(input, csr);
                // move to ends of cursors
                nodes = arr.reduce((acc,branch) => {
                    const deep = this.parse(branch,[...nodes]);
                    return acc.concat(deep);
                },[]);
                nodes = [...new Set(nodes)]; // unique
                csr += Area.calcCursorOffset(arr) - 1;
            }
            csr++;
        }
        return nodes;
    }

    newNode(currNode, direction) {
        let {x,y} = currNode;
        if (direction === 'N') {
            y += 1;
        } else if (direction === 'S') {
            y -= 1;
        } else if (direction === 'W') {
            x -= 1;
        } else if (direction === 'E') {
            x += 1;
        }
        // make sure only one instance of a node exists
        const nodeKey = Area._nodeKey({x,y});
        let res = this.nodeMap.get(nodeKey);
        if(!res) {
            res = {x,y,next:[]};
            this.nodeMap.set(nodeKey,res);
        }

        if(!currNode.next.includes(res)) {
            currNode.next.push(res);
        }
        return res;
    }

    static _nodeKey(node) {
        return `${node.x}_${node.y}`
    }

    static calcCursorOffset(branches) {
        let res = 0;
        res += branches.length + 1; // open- and close-braces and pipes
        res += branches.reduce((acc, curr) => acc + curr.length, 0); // all characters added
        return res;
    }

    static branches(input, startingFrom=0) {
        let csr = startingFrom;
        let braceCnt = 0;
        let res = [];
        let branch = "";
        while(braceCnt !== 0 || !res.length) {
            const sign = input.charAt(csr);
            if(sign === '|' && braceCnt === 1){ // new branch sibling
                res.push(branch);
                branch = "";
            } else {
                if(sign === ')') {
                    braceCnt--;
                } else if(sign === '(') {
                    braceCnt++;
                }
                branch += sign;
            }
            csr++;
        }
        // add last branch iteration
        res.push(branch);
        // remove current's branch open/close
        res[0] = res[0].substr(1);
        res[res.length-1] = res[res.length-1].substr(0,res[res.length-1].length-1);
        return res;
    }
}

export class Dijkstra {
    constructor(nodes, startNode) {
        nodes.forEach(node => {
            node.distance = Number.MAX_SAFE_INTEGER;
        });
        startNode.distance = 0;
        this.allNodes = [...nodes];
        this.queue = new PriorityQueue([... nodes], (node) => node.distance);
    }
    run() {
        while(this.queue.length) {
            let curr = this._nextInQueue();
            let neighbors = this._neighborsOf(curr);
            for(let neighbor of neighbors) {
                if(this.queue.includes(neighbor)) {
                    this._updateDistance(curr, neighbor);
                }
            }
        }
        return this.allNodes;
    }
    _updateDistance(u,v) {
        let alt = u.distance + 1;
        if(alt < v.distance) {
            const oldDistance = v.distance;
            v.distance = alt;
            this.queue.resort(v, oldDistance)
        }
    }
    _nextInQueue() {
        return this.queue.next();
    }
    _neighborsOf(node) {
        return node.next || [];
    }
}