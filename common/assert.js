function toBe(left, right) {
    if(left !== right) {
        console.error(`Expected ${right} is not equal ${left}`);
    } else {
        return left;
    }
}function notToBe(left, right) {
    if(left === right) {
        console.error(`Expected ${right} should not equal ${left}`);
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
        return notToBe(parseInt(this), right);
    } else {
        return notToBe(parseFloat(this), right);
    }
};