'use strict'

var { Storage } = require('@google-cloud/storage');

var storage = new Storage();

var __bucket = storage.bucket('stock.searchscreener.com');



function bucket() {
    return __bucket;
}



function file(fileName) {
    return __bucket.file(fileName);
}



function getFiles(prefix, delimiter) {
    var options = {
        prefix: prefix,
    };

    if (delimiter) {
        options.delimiter = delimiter;
    }

    var files = null;
    if (!prefix)
        files = bucket().getFiles();
    else
        files = bucket().getFiles(options);

    return files;
}




function getTempPath() {
    return 'cron-temp/';
}



function moveAll(from, to) {
    return new Promise(async (resolve, reject) => {
        try {
            var data = await bucket().getFiles({
                prefix: from
            });

            const files = data[0];

            for (var i = 0; i < files.length; i++) {
                var name = files[i].metadata.name;
                var toPath = name.substr(from.length);
                await files[i].move(file(to + toPath));
            }

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    bucket,
    file,
    getFiles,
    getTempPath,
    moveAll
}