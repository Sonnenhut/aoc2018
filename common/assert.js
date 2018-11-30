function toBe(left, right) {
    console.log(left, right);
    if(left !== right) {
        console.error(`Expected ${left} is not equal ${right}`);
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