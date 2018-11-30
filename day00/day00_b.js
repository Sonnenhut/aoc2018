import {fileAsText} from "../common/files.js";

export default async function main() {
    solve('1212').toBe(6);
    solve('1221').toBe(0);
    solve('123425').toBe(4);
    solve('123123').toBe(12);
    solve('12131415').toBe(4);
    return fileAsText('day00/input.txt').then(input => {
        return solve(input).toBe(1278)
    });
}

function solve(input) {
    let result = 0;
    let howManyAhead = input.length / 2;
    for(let i=0; i < input.length; i++) {
        let nextIdx = (i + howManyAhead) % input.length;
        if(input.charAt(i) === input.charAt(nextIdx)) {
            result += parseInt(input.charAt(i));
        }
    }
    return result;
}