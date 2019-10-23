'use strict'

var { Storage } = require('@google-cloud/storage');

var storage = new Storage();



function restore(fromBucketName, fromPath, toBucketName, toPath) {
    return new Promise(async (resolve, reject) => {
        try {
            var fromBucket = storage.bucket(fromBucketName);

            var toBucket = storage.bucket(toBucketName);

            var exists1 = await fromBucket.exists();
            var exists2 = await toBucket.exists();

            if (!exists1[0] || !exists2[0]) throw new Error(`Bucket 이 존재하지 않습니다. fromBucket exists ${exists1[0]}, toBucket exists ${exists2[0]}`);

            var data = await fromBucket.getFiles({
                prefix: fromPath
            });

            const files = data[0];

            for (var i = 0; i < files.length; i++) {
                var name = files[i].metadata.name;
                var to = toPath + name.substr(fromPath.length);
                await files[i].copy(toBucket.file(to));
            }

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    restore
}