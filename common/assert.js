function toBe(left, right, invert) {
    if(left !== right && invert !== true) {
        console.error(`Expected ${left} is not equal ${right}`);
    } else if(left === right && invert) {
        console.error(`Expected ${left} should not equal ${right}`);
    } else {
        return left;
    }
}

Number.prototype.toBe = function(right) {
    // check if left is int or float
    if(this % 1 === 0) {
        return toBe(parseInt(this), right);
    } else {
        return toBe(parseFloat(this), right);
    }
};

Number.prototype.notToBe = function(right) {
    if(this % 1 === 0) {
        return toBe(parseInt(this), right, true);
    } else {
        return toBe(parseFloat(this), right, true);
    }
};