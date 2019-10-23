module.exports = function(ms) {
    var _ms = ms || 1000;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve();
        }, _ms);
    });
}