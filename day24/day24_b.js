import {fileAsText} from "../common/files.js";
import {EXAMPLE, fightTillEnd, parseArmies} from "./day24_a.js";

export default async function main() {
    findMinimalBoostSurvivors(EXAMPLE).toBe(51);

    return fileAsText('day24/input.txt').then(input => {
        const res = findMinimalBoostSurvivors(input);
        res.notToBe(1229); //too low
        res.notToBe(12607); // too high
        res.toBe(12084);
        return res;
    });
};

function findMinimalBoostSurvivors(input) {
    let boost = 0;
    let immuneSystemWinningCnt = 0;
    while(!immuneSystemWinningCnt) {
        let {immuneSystem, infection} = parseArmies(input);
        immuneSystem.boost(boost);
        try {
            fightTillEnd(immuneSystem, infection);
            immuneSystemWinningCnt = immuneSystem.totalUnits;
        } catch(e) {
            console.warn(`Possible deadlock at boost ${boost}, skipping`);
            immuneSystemWinningCnt = 0;
        }
        boost += 1;
    }
    return immuneSystemWinningCnt;
}