import { fileAsText } from '../common/files.js'

// some old aoc to see test my setup
export default async function main() {
    solve('1122').toBe(3);
    solve('1111').toBe(4);
    solve('1234').toBe(0);
    solve('91212129').toBe(9);

    return fileAsText('day00/input.txt').then(input => {
        return solve(input).toBe(1253)
    });
};

function solve(input) {
    let result = 0;
    for(let i=0; i < input.length; i++) {
        let nextIdx = i === input.length - 1 ? 0 : i+1;
        if(input.charAt(i) === input.charAt(nextIdx)) {
            result += parseInt(input.charAt(i));
        }
    }
    return result;
}