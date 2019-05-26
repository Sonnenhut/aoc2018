import {fileAsText} from '../common/files.js'
import {Area} from "./day18_a.js";

export default async function main() {
    return fileAsText('day18/input.txt').then(input => {
        let res =  Area.parse(input).tick(1000000000).resourceValue;
        res.notToBe(187680); // too high
        res.notToBe(134393); // too low

        res.notToBe(195325); // too high
        res.notToBe(189120); // ?? not right
        res.notToBe(196452); // ?? not right
        res.notToBe(187035); // ?? not right
        res.notToBe(182478); // ?? not right

        res.toBe(174584); // finally!
        return res;
    });
};
