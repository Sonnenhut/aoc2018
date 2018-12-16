import {fileAsText} from '../common/files.js'

export default async function main() {

    const chain = Recipe.createRing(3,7);
    chain.self.toBe(3);
    chain.next.self.toBe(7);
    chain.next.next.self.toBe(3);



    solve('01245').toBe(5);
    solve('51589').toBe(9);
    solve('92510').toBe(18);
    solve('59414').toBe(2018);
    solve('793031').toBe(42);

    return fileAsText('day14/input.txt').then(input => {
        //return solve(input).toBe(4910101614);
    });

};

export function solve(searchToken) {
    let state = new Map();
    state.set(0,3);
    state.set(1,7);
    let firstIdx = 0;
    let secondIdx = 1;

    let lastSeq = '';

    let loop = 0;

    while(lastSeq !== searchToken) {
        const oldRecipeSize = state.size;
        state = withNewRecipes(state, firstIdx, secondIdx);
        firstIdx = (state.get(firstIdx) + firstIdx + 1) % state.size;
        secondIdx = (state.get(secondIdx) + secondIdx + 1) % state.size;

        // add new characters to our search term
        for(let idx = oldRecipeSize; idx < state.size; idx++) {
            lastSeq += state.get(idx);
            if(lastSeq.length > searchToken.length) {
                lastSeq = lastSeq.slice(1); // omit the first character, to match the size of the searchToken
            }
        }
    }

    return state.size - searchToken.length;
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