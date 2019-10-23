'use strict'

const defaults = require('./module/defaults');


function get(fileName, n) {
    return new Promise(async (resolve, reject) => {
        try {
            var docData = {};

            var rows = await defaults.get(fileName, n);
            
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                docData[`open${i}`] = row.open;
                docData[`close${i}`] = row.close;
                docData[`high${i}`] = row.high;
                docData[`low${i}`] = row.low;
                docData[`volume${i}`] = row.volume;
                docData[`change${i}`] = row.change;
                docData[`changePercent${i}`] = row.changePercent;
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