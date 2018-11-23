export function toBe(left, right) {
    if(left !== right) {
        console.error(`Expected ${left} is not equal ${right}`);
    }
}