import {fileAsText} from '../common/files.js'
import {EXAMPLE_DAY, parse} from './day08_a.js'

export default async function main() {
    solve(EXAMPLE_DAY).toBe(66);
    return fileAsText('day08/input.txt').then(input => {
        return solve(input) //
    });
};

export function solve(input) {
    return parse(input).value();
}
