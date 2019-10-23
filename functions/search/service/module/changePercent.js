'use strict'

const storage = require('../inner/storage');

const api = require('../inner/api');


function get(fileName, n) {
    return new Promise(async (resolve, reject) => {
        try {
            var file = storage.file(fileName);
            var input = file.createReadStream();

            var lastClose;
            var count = 0;

            var onFn = {};
            onFn.validate = row => {
                return row.volume > 0 && count++ < n;
            };
            onFn.data = row => {
                if (!lastClose) {
                    lastClose = row.close;
                }

                return count < 2 ? null : ((lastClose - row.close) / row.close).toFixed(6);
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