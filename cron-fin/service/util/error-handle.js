'use strict'



let error = null;



function init() {
    error = null;
}



function eventerr(fn, catchCallback) {
    try {
        if (!hasError()) {
            return fn();
        }
    } catch (e) {
        error = e;
        catchCallback && catchCallback(e);
    }
}



function hasError() {
    return error !== null ? true : false;
}



function getError() {
    return error;
}



module.exports = {
    init,
    eventerr,
    hasError,
    getError
}