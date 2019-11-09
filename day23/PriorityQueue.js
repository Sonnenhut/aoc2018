// priorityQueue for poor ppl
export class PriorityQueue {
    constructor(nodes, idxFn = (node) => node.ordinal, compareIdxFn = (left, right) => left - right, ) {
        this._compareFn = compareIdxFn;
        this._idxFn = idxFn;
        this._nodes = new Map();
        this.addAll(nodes);
    }
    add(node) {
        const idx = this._idxFn(node);
        const withSameIdx = this._nodes.get(idx) || [];
        withSameIdx.push(node);
        this._nodes.set(idx, withSameIdx);
    }
    addAll(nodes) {
        nodes.forEach(node => {
            this.add(node)
        });
    }
    includes(node) {
        let res = false;
        for(let arr of this._nodes.values()) {
            if(arr.includes(node)) {
                res = true; break;
            }
        }
        return res;
    }
    get length() {
        return [...this._nodes.values()].reduce((acc, array) => {
           return acc + array.length
        },0);
    }
    next() {
        const sortedKeys = [...this._nodes.keys()].sort((left, right) => this._compareFn(left, right));
        const nextKey = sortedKeys[0];
        const res = this._nodes.get(nextKey).pop();
        if(!this._nodes.get(nextKey).length) {
            this._nodes.delete(nextKey);
        }
        return res;
    }
}

/*
export class PriorityQueue {
    constructor(nodes, compareFn = (left, right) => left.ordinal - right.ordinal) {
        this._nodes = [...nodes];
        this._compareFn = compareFn;
    }
    sort() {
       this._nodes = this._nodes.sort((left, right) => this._compareFn(left, right));
    }
    add(node) {
        this._nodes.push(node);
        this.sort();
    }
    addAll(nodes) {
        this._nodes.push(...nodes);
        this.sort();
    }
    includes(node) {
        return this._nodes.includes(node);
    }
    get length() {
        return this._nodes.length;
    }
    next() {
        return this._nodes.shift(); // take with lowest ordinal
    }
    remove(toRemove) {
        const idx = this._nodes.indexOf(toRemove);
        if(idx > -1) {
            this._nodes.splice(idx, 1);
        }
    }
}
*/