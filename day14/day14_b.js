import {fileAsText} from '../common/files.js'

export default async function main() {

    const chain37 = Recipe.createRing(3,7);
    chain37.self.toBe(3);
    chain37.next.self.toBe(7);
    chain37.next.next.self.toBe(3);

    const [r1, r0] = Recipe.recipesBySum(chain37, chain37.next);
    r1.self.toBe(1);
    r0.self.toBe(0);
    const chain3710 = chain37.next.append(r1).append(r0).next;
    chain3710.self.toBe(3);
    chain3710.next.self.toBe(7);
    chain3710.next.next.self.toBe(1);
    chain3710.next.next.next.self.toBe(0);
    chain3710.next.next.next.next.self.toBe(3);
    // same wit move()
    chain3710.self.toBe(3);
    chain3710.move(1).self.toBe(7);
    chain3710.move(2).self.toBe(1);
    chain3710.move(3).self.toBe(0);
    chain3710.move(4).self.toBe(3);

    chain3710.unique().length.toBe(4);
    chain3710.distance(chain3710.move(3)).toBe(3);

    solve('51589').toBe(9);
    solve('01245').toBe(5);
    solve('92510').toBe(18);
    solve('59414').toBe(2018);

    return fileAsText('day14/input.txt').then(input => {
        return solve(input).toBe(20253137);
    });
};

export function solve(searchToken) {
    let searchRecipes = searchToken.split('').map(self => new Recipe(parseInt(self)));
    let start = Recipe.createRing(3,7);
    let first = start;
    let second = start.next;
    let last = second;
    let cursor = first;
    let cursorActive = false;

    const isCursorAtPosition = () => {
        let csr = cursor;
        let res = true;
        for(let toSearch of searchRecipes) {
            if(toSearch.self !== csr.self) {
                res = false;
                break;
            }
            csr = csr.next;
        }
        return res;
    };

    while(!isCursorAtPosition()) {
        let toAppendArr = Recipe.recipesBySum(first, second);
        for(let toAppend of toAppendArr) {
            last = last.append(toAppend);
        }
        first = first.move(first.self + 1);
        second = second.move(second.self + 1);

        // re-place the cursor and check
        if(cursorActive) {
            for(let _ of toAppendArr) {
                cursor = cursor.next;
                if(isCursorAtPosition()) {
                    break
                }
            }
        } else if(first.unique().length >= searchRecipes.length) {
            cursorActive = true;
        }
    }
    console.log('counting distance');
    return start.distance(cursor);
}


function toDigitArray(number) {
    return number.toString().split('').map(item => parseInt(item));
}


Array.prototype.asMap = function() {
    let res = new Map();
    this.forEach((item, idx) => {
       res.set(idx, item);
    });
    return res;
};


class Recipe {
    // inspired by the marbles Day
    constructor(self) {
        this.self = self;
    }
    append(other) {
        let afterNext = this.next;
        this.next = other;
        other.next = afterNext;
        return other;
    }
    move(cnt) {
        let res = this;
        for(let idx = 0; idx < cnt; idx++) {
            res = res.next;
        }
        return res;
    }
    unique() {
        let res = [];
        let cursor = this;
        while(!res.includes(cursor)) {
            res.push(cursor);
            cursor = cursor.next;
        }
        return res;
    }
    distance(other) { // distance from this to other
        let res = 0;
        let csr = this;
        while(other !== csr) {
            res ++;
            csr = csr.next;
        }
        return res;
    }
    static recipesBySum(... recipes) {
        let sum = recipes.reduce((acc, curr) => acc + curr.self, 0);
        return toDigitArray(sum).map(self => new Recipe(self));
    }
    static createRing(... args) {
        let last;
        let first;
        for(let arg of args) {
            if(!first) {
                first = new Recipe(arg);
                last = first;
            } else {
                const next = new Recipe(arg);
                last.next = next;
                last = next;
            }
        }
        last.next = first; // close the loop
        return first;
    }
}