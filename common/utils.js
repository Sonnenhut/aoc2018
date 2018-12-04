// increases the value of a map entry by one
// sets it to one if there is no entry already
Map.prototype.inc = function(key) {
    let prev = this.get(key);
    if(prev) {
        this.set(key, prev + 1);
    } else {
        this.set(key, 1)
    }
};