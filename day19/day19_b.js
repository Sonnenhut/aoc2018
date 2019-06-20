import {fileAsText} from "../common/files.js";
import {Program} from "./day19_a.js";

export default async function main() {

    return fileAsText('day19/input.txt').then(input => {
        const res = new Day19AsJsImproved().run(1);
        res.notToBe(34512496); // too high
        res.notToBe(8628313); // too low
        res.notToBe(10552225); // too low
        res.notToBe(15828336); // nope ???
        res.notToBe(21104449); // nope ???
        res.toBe(10576224);
        return res;
    });
};

class Day19AsJsImproved {
    funcAtRow1(r1) {
        return this.funcAtRow3(r1);
    }
    funcAtRow3(n) {
        let res = new Set(); // r0;

        let i=0;
        for(i = 0; i <= n; i++) {
            if(n % i === 0) {
                res.add( i );
                res.add( n/1 );
            }
        }
        return Array.from(res).reduce((acc, curr) => acc + curr, 0);
    }

    run(r0){ // 0=part1, 1=part2
        let res;
        // line 17 -> 24
        let r1 = 911;

        if(r0 === 0) {
            res = this.funcAtRow1(r1);
        } else {
            // line 27 -> 35
            r1 += 10550400;
            res = this.funcAtRow1(r1);
        }
        return res;
    }
}


/**
 * Solution:
 * Given a number (part1: 911, part2: 8628061)
 * find out much combinations there are to create this product
 *
 */
/*
class Day19AsJs {
    funcAtRow1(r1) {
        //r[2] = 1
        //r[5] = 1
        return this.funcAtRow3(r1, 1,1);
    }
    funcAtRow3(r1, r2, r5) {
        let res = 0; // r0;
        do {
            do {
                if(r1 === (r5 * r2)) {
                    res += r2
                }
                r5++;
            } while (r5 <= r1);
            r2++;
            r5 = 1;
        } while (r2 <= r1);
        return res;
    }

    run(r0){ // 0=part1, 1=part2
        let res;
        // line 17 -> 24
        let r1 = 911;

        if(r0 === 0) {
            res = this.funcAtRow1(r1);
        } else {
            // line 27 -> 35
            r1 += 8627150;
            res = this.funcAtRow1(r1);
        }
        return res;
    }
}
*/