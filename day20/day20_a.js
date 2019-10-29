import { fileAsText } from '../common/files.js'

const SIMPLE = `^N(N|W)W$`;
const BRANCH_IN_BRANCH = `^N(N(N|W)|W)N(N|W)S$`;
const EXAMPLE = `^ENWWW(NEEE|SSE(EE|N))$`;
const EXAMPLE_31 = "^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$";
const EXAMPLE_23 = "^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$";
const EXAMPLE_18 = "^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$";
const EXAMPLE_10 = "^ENWWW(NEEE|SSE(EE|N))$";

export default async function main() {
    //const site = parseInput(SIMPLE);
    let locs = undefined;
    const test = (input) => {
        let tree = parseTree(input);
        console.log(tree);
        return getFurthestMove(tree);
    };
    //test(EXAMPLE_10).toBe(10); // ok
    //test(EXAMPLE_31).toBe(31); // ok

    test(EXAMPLE_23).toBe(23);
    //test(EXAMPLE_18).toBe(18);



    return fileAsText('day20/input.txt').then(input => {
        /*
        locs = parseTree(input);
        let res = getFurthestMove(locs);
        res.notToBe(58); // not correct
        return res;
        */
    });
};

function getFurthestMove(locs) {
    const moves = [... locs.values()]
        .map(moves => [...moves.values()].sort(sortNum)[0]) // of same rooms, keep the shortest move cnt
        .sort(sortNum);
    return moves[moves.length-1]; // get longest move
}

class Node {
    constructor(parent) {
        this.parent = parent;
        this.locX = (parent && parent.locX) || 0;
        this.locY = (parent && parent.locY) || 0;
        this.moves = (parent && parent.moves) || 0;
        this.children = [];
        if(parent) {
            this.parent.children.push(this);
        }
    }
    loc() {
        return `${this.locX}_${this.locY}`;
    }
    move(direction) {
        switch(direction) {
            case 'N':
                this.locY++;
                break;
            case 'S':
                this.locY--;
                break;
            case 'W':
                this.locX--;
                break;
            case 'E':
                this.locX++;
                break;
        }
        this.moves++;
    }
    deepestChildren() {
        let res = [this];
        let deeper = true;
        while(deeper) {
            res = res.reduce((prev, currNode) => {
                const toPush = currNode.children.length === 0 ? [currNode] : currNode.children;
                prev.push(... toPush);
                return prev;
            },[]);
            deeper = res.reduce((acc, curr) => {
                acc |= curr.children.length > 0;
                return acc;
            }, false);
        }
        return res;
    }
}

function parseTree(input) {
    const locations = new Map();
    input = input.replace('^','');
    input = input.replace('$','');
    let nodes = [new Node()]; // cursors
    let lastChar = undefined;
    for(const char of input) {
        switch(char) {
            case '(':
                nodes = nodes.map(node => new Node(node));
                break;
            case ')':
                nodes = nodes.map(node => node.parent);
                break;
            case '|':
                nodes = nodes.map(node => new Node(node.parent));
                break;
            default:
                nodes = nodes.reduce((prev, curr) => {
                    prev.push(... curr.deepestChildren());
                    return prev;
                },[]);
                nodes.forEach(node => node.move(char));
                // remember locations
                nodes.forEach(node => {
                    // fill locations and with steps
                    const key = node.loc();
                    const currentSteps = node.moves;
                    let allSteps = locations.get(key);
                    if(!allSteps) {
                        allSteps = new Set();
                    }
                    allSteps.add(currentSteps);
                    locations.set(key, allSteps);
                });
                // remove nodes that are on the same location
                nodes = shortestPath(nodes);
                if(nodes.length === 0) {
                    console.log('whoops something went wrong!!!', char, lastChar, locations)
                }
                break;
        }
        lastChar = char;
    }
    // try to check if two paths use the same route
    return locations;//getRoot(nodes[0]);
}

/**
 * Keep nodes with the shortest path to the same location
 */
function shortestPath(nodes) {
    const sameLocNodes = new Map();
    nodes.forEach(node => {
        const key = node.loc();
        let arr = sameLocNodes.get(key);
        if(!arr) {
            arr = [];
        }
        arr.push(node);
        sameLocNodes.set(key, arr);
    });
    // find the nodes with the smallest move for the same location
    return [...sameLocNodes.values()].flatMap(nodeArr => {
       const smallestMoves = smallestNum(nodeArr.map(node => node.moves));
       return nodeArr.filter(node => node.moves === smallestMoves);
    });
}

function smallestNum(iterable) {
    return [...iterable].sort(sortNum)[0];
}

function getRoot(node) {
    let res = node;
    while(res.parent) {
        res = res.parent;
    }
    return res;
}

function sortNum (a,b)  {
    return a - b;
}