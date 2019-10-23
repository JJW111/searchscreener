'use strict'

var userCounter = 0;

module.exports = (req, res, next) => {
    userCounter++;
    console.log('오늘 페이지 뷰: ' + userCounter);
    return next();
}
