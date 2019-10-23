'use strict'

const storage = require('../inner/storage');

const api = require('../inner/api');


function get(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            var file = storage.file(fileName);
            var input = file.createReadStream();

            var onFn = {};
            onFn.data = row => {
                return row[0];
            };

            var data = await api.get(input, onFn, { headers: false, delimiter: ',' });
            
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}





module.exports = {
    get
}