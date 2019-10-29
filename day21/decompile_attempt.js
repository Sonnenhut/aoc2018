function calcR2AfterLine17(r3) {
    // first power of 256 that is bigger than r3 (res = power)
    let r5;
    let r2 = 0;
    let loop = true;
    {
        r5 = r2 + 1;
        r5 = r5 * 256;
        if(r5 > r3) {
            loop = false;
        } else {
            r2++;
        }
    } while(loop);
    return r2;
}

function calcR4AfterLine7(r3, r4) {
    let r2 = Math.min(r3, 255); // not higher than 255
    r4 = r4 + r2;
    r4 = Math.min(r4, 16777215); // not higher than 1677...
    r4 = r4 * 65899;
    r4 = Math.min(r4, 16777215); // not higher than 1677...
    return r4;
}

function pgm() {
    let r0=0,r1=0,r2=0,r3=0,r4=0,r5=0;
    r4 = 0; // line 5
    outer: do {
        r3 = r4 | 65536;
        r4 = 12670166; // line 7
        do {
            r4 = calcR4AfterLine7(r3, r4);
            if (256 > r3) {
                continue outer; // check and continue
            }
            // power of 256 that is bigger than r3
            r3 = calcR2AfterLine17(r3);
        } while(true);
    } while(r4 !== r0);
    return true;
}