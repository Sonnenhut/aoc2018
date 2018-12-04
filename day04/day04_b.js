import {fileAsText} from '../common/files.js'
import {parseGuards, parseLogEntries} from './day04_a.js'

export default async function main() {
    return fileAsText('day04/input.txt').then(input => {
        const inputGuards = parseGuards(parseLogEntries(input));
        return solve(inputGuards).toBe(128617);
    });
};

function solve(guards) {
    const topFrequency = guards.reduce((prev, curr) => prev.getTopNapFrequency() > curr.getTopNapFrequency() ? prev : curr);
    return topFrequency.getId() * topFrequency.getTopNapMinute();
}