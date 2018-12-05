import {fileAsText} from '../common/files.js'

export const abc = "abcdefghijklmnopqrstuvwxyz";
export const TRIGGERS = abc.split('').reduce((all, char) => {
    all.push(char + char.toUpperCase());
    all.push(char.toUpperCase() + char);
    return all;
}, []);

export default async function main() {

    trigger("aAAa").toBe("");
    trigger("dabAcCaCBAcCcaDA").toBe("dabCBAcaDA");
    solve("dabAcCaCBAcCcaDA").toBe(10);

    return fileAsText('day05/input.txt').then(input => {
        return solve(input).toBe(11754);
    });
};

export function solve(polymer) {
    return trigger(polymer).length;
}

function trigger(polymer) {
    let res = polymer;
    let triggerAble = new RegExp(TRIGGERS.join('|'),'g');

    let lastPolymerLength = 0;
    while (lastPolymerLength !== res.length) {
        lastPolymerLength = res.length;
        res = res.replace(triggerAble, '');
    }
    return res;
}