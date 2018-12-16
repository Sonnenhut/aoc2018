import {fileAsText} from '../common/files.js'

export default async function main() {

    toDigitArray(9123).toBe([9,1,2,3]);
    withNewRecipes([3,7].asMap(),0,1).toBe([3,7,1,0].asMap());
    withNewRecipes([3,7,1,0].asMap(),0,1).toBe([3,7,1,0,1,0].asMap());
    withNewRecipes([3,7,1,0,1,0].asMap(),4,3).toBe([3,7,1,0,1,0,1].asMap());
    withNewRecipes([3,7,1,0,1,0,1,2,4,5,1,5,8,9,1,6,7,7,9].asMap(),6,2).toBe([3,7,1,0,1,0,1,2,4,5,1,5,8,9,1,6,7,7,9,2].asMap());

    solve(5).toBe('0124515891');
    solve(18).toBe('9251071085');
    solve(2018).toBe('5941429882');

    return fileAsText('day14/input.txt').then(input => {
        return solve(parseInt(input)).toBe(4910101614);
    });
};

export function solve(ripeness) {
    let state = new Map();
    state.set(0,3);
    state.set(1,7);
    let firstIdx = 0;
    let secondIdx = 1;

    while(state.size < ripeness + 10) {
        state = withNewRecipes(state, firstIdx, secondIdx);
        firstIdx = (state.get(firstIdx) + firstIdx + 1) % state.size;
        secondIdx = (state.get(secondIdx) + secondIdx + 1) % state.size;
        if(state.size % 10000 === 0) {
            console.log('state size', state.size)
        }
    }

    let res = '';
    for(let idx = ripeness; idx < ripeness + 10; idx++) {
        res += state.get(idx);
    }
    return res;
}

function withNewRecipes(allRecipes, first, second) {
    const sumDigits = toDigitArray(allRecipes.get(first) + allRecipes.get(second));
    let newIdx = allRecipes.size;
    for(let digit of sumDigits) {
        allRecipes.set(newIdx, digit);
        newIdx++;
    }
    return allRecipes;
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