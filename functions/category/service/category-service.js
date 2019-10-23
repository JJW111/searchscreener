'use strict'

const category = require('./module/category');


function get(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            var data = await category.get(fileName);
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    get
}