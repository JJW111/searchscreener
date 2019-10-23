'use strict'

const changePercent = require('./module/changePercent');


function get(fileName, n) {
    return new Promise(async (resolve, reject) => {
        try {
            var docData = {};

            var data = await changePercent.get(fileName, n + 1);
            
            for (var i = 0; i < data.length; i++) {
                var key = 'day' + (i + 2) + 'ChangePercent';
                docData[key] = data[i];
            }
            
            resolve(docData);
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    get
}