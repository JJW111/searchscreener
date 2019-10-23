'use strict'

const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const date = require('../service/inner/date');

const root = date.get();



function backup(from, to) {
    return new Promise(async (resolve, reject) => {
        try {
            var fromBucket = storage.bucket(from);
            var toBucket = storage.bucket(to);

            var e1 = await fromBucket.exists();
            var e2 = await toBucket.exists();

            if (!e1[0]) {
                throw new Error(`Backup Bucket ${from} 이 존재하지 않습니다.`);
            }

            if (!e2[0]) {
                throw new Error(`Backup Bucket ${to} 이 존재하지 않습니다.`);
            }

            var data = await fromBucket.getFiles();

            const files = data[0];

            for (var i = 0; i < files.length; i++) {
                var name = files[i].metadata.name;
                await files[i].copy(toBucket.file(root + '/' + name));
            }

            resolve({count: files.length});
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    backup
}