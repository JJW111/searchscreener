'use strict'

var { Storage } = require('@google-cloud/storage');

var storage = new Storage();

var __bucket = storage.bucket('stock.searchscreener.com');;



function bucket() {
    return __bucket;
}



function file(fileName) {
    return __bucket.file(fileName);
}



module.exports = {
    bucket,
    file
}