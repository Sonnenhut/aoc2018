export function toBe(left, right) {
    if(left !== right) {
        console.error(`Expected ${left} is not equal ${right}`);
    } else {
        return left;
    }
}

Object.prototype.toBe = function(right) {
  return toBe(this, right);
};