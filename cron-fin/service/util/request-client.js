var request = require('request');


module.exports = function requestClient(uri) {
    return new Promise(async (resolve, reject) => {
        request(uri, function (error, response, body) {
            if (error) return reject(err);
            if (response && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(`response statusCode is ${response.statusCode}`)
            }
        });
    });
}