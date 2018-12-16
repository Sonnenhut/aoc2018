function expect(left) {
    return new Expectation(left);
}

function toBe(left, right) {
    if(left !== right) {
        console.error(`Expected ${right} is not equal ${left}`);
    } else {
        return left;
    }
}
function notToBe(left, right) {
    if(left === right) {
        console.error(`Expected ${right} should not equal ${left}`);
    } else {
        return left;
    }
}

Boolean.prototype.toBe = function(right) {
    if(this.valueOf() !== right) {
        console.error(`Expected ${right} is not equal ${this}`);
    } else {
        return this
    }
};

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

String.prototype.toBe = function(right) {
    return toBe(this.valueOf(), right.valueOf());
};
String.prototype.notToBe = function(right) {
    return notToBe(this.valueOf(), right.valueOf());
};

Array.prototype.toBe = function(right) {
    const logError = () => console.error(`Expected '${right}' is not equal '${this}'`);

    if(this === right) return this;
    if(right == null || this.length !== right.length) {
        logError();
        return;
    }

    for(let i = 0; i < this.length; i++) {
        if(this[i].toBe(right[i]) === undefined) {
            logError();
            return
        }
    }
    return this;
};
Map.prototype.toBe = function(right) {
    const logError = () => console.error(`Expected '${right}' is not equal '${this}'`);

    if(this === right) return this;
    if(right == null || this.size !== right.size) {
        logError();
        return;
    }

    for(let key of this.keys()) {
        if(this.get(key).toBe(right.get(key)) === undefined) {
            logError();
            return;
        }
    }
    return this;
};

class Expectation {
    constructor(left) {
        this.left = left;
    }
    toBe(right) {
        if(this.left === undefined) {
            if(right !== undefined) {
                console.error(`Expected '${right}' is not equal '${this.left}'`);
            } else {
                return this.left;
            }
        } else {
            return this.left.toBe(right);
        }
    }
}