import {fileAsText} from '../common/files.js'

export const EXAMPLE_DAY = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";

export default async function main() {
    solve(EXAMPLE_DAY).toBe(138);
    return fileAsText('day08/input.txt').then(input => {
        return solve(input) //
    });
};

export function solve(input) {
    return parse(input).flattened().map(node => node.metadataSum()).sum();
}

export function parse(input) {
    const seq = inputGenerator(input);

    const readAmount = (cnt) => {
        let res = [];
        for(let i=0; i < cnt;i++) {
            res.push(seq.next().value);
        }
        return res;
    };

    const readNode = (cnt) => {
        let res = [];
        for(let i=0; i < cnt; i++) {
            const childCnt = seq.next().value;
            const metadataCnt = seq.next().value;
            const childNodes = readNode(childCnt);
            const metadata = readAmount(metadataCnt);
            res.push(new Node(childNodes, metadata));
        }
        return res;
    };

    return readNode(1)[0];
}

function* inputGenerator(input) {
    const values = input.split(' ');
    for(let value of values) {
        yield parseInt(value);
    }
}

class Node {
    constructor(children, metadata) {
        this.children=children;
        this.metadata=metadata;
    }
    metadataSum() {
        return this.metadata.sum();
    }
    value() {
        let res = 0;
        if(this.children.length === 0) {
            // If a node has no child nodes, its value is the sum of its metadata entries.
            res = this.metadataSum();
        } else {
            // However, if a node does have child nodes, the metadata entries become indexes which refer to those child nodes.
            res = this.metadata.map(meta => meta - 1)
                                .map(idx => {
                                    let res = 0;
                                    if(this.children[idx]) {
                                        res = this.children[idx].value()
                                    }
                                    return res;
                                })
                                .sum();
        }
        return res;
    }
    flattened() {
        if(this.children.length > 0) {
            const flattenedChilds = this.children.reduce((acc, curr) => {
                acc.push(...curr.flattened());
                return acc;
            }, []);
            return [this, ...flattenedChilds];
        } else {
            return [this];
        }
    }
}

Array.prototype.sum = function() {
    return this.reduce((sum, current) => sum += current, 0);
};