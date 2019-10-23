'use strict'

const storage = require('../inner/storage');

const api = require('../inner/api');




function get(fileName, n) {
    return new Promise(async (resolve, reject) => {
        try {
            var file = storage.file(fileName);
            var input = file.createReadStream();

            var count = 0;
            var onFn = {};
            onFn.validate = row => {
                return row.volume > 0 && count++ < n;
            };
            onFn.data = row => {
                return row;
            };

            var data = await api.get(input, onFn);

            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    get
}