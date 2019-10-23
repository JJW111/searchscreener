'use strict'

var { Storage } = require('@google-cloud/storage');

var storage = new Storage();



function reload(bucketName, path) {
    return new Promise(async (resolve, reject) => {
        try {
            var bucket = storage.bucket(bucketName);

            var exists = await bucket.exists();

            if (!exists[0]) throw new Error(`Bucket[${bucketName}]이 존재하지 않습니다.`);

            var file = bucket.file(path);

            var exists1 = await file.exists();

            if (!exists1[0]) throw new Error(`파일 ${bucketName}/${path}가 존재하지 않습니다.`);

            await file.copy('reload-temp/' + path);

            var copyedFile = bucket.file('reload-temp/' + path);

            var exists2 = await copyedFile.exists();

            if (!exists2[0]) throw new Error(`복사 파일 ${bucketName}/${path}가 존재하지 않습니다.`);

            await copyedFile.move(path);

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}


function reloadAll(bucketName, path) {
    return new Promise(async (resolve, reject) => {
        try {
            var bucket = storage.bucket(bucketName);

            var exists = await bucket.exists();

            if (!exists[0]) throw new Error(`Bucket[${bucketName}]이 존재하지 않습니다.`);

            var data = await bucket.getFiles({
                prefix: path
            });

            const files = data[0];
            var promises = [];
            var failed = 0;
            var list = [];
            var failedList = [];
            var count = 0;

            for (var i = 0; i < files.length; i++) {
                var name = files[i].metadata.name;
                var to = getTempPath() + path + name.substr(path.length);
                promises.push(promiseReload(files[i], to)
                    .then(name => {
                        list.push(name);
                        count++;
                    })
                    .catch(err => {
                        console.error(err.msg);
                        failedList.push(err.name);
                        failed++;
                    })
                );

                if (i % 1000 === 0) {
                    await Promise.all(promises);
                    promises.length = 0;
                }
            }

            if (promises.length > 0) {
                await Promise.all(promises);
            }

            return resolve({ total: files.length, count: count, list: list, failed: failed, failedList: failedList });
        } catch (err) {
            return reject(err);
        }
    });
}



function promiseReload(file, to) {
    return new Promise((resolve, reject) => {
        file.copy(to)
            .then(data => {
                var newFile = data[0];
                newFile.move(newFile.name.substr(getTempPath().length))
                    .then(data => {
                        return resolve(data[0].name);
                    })
                    .catch(err => {
                        return reject({ msg: `Reload copy Error: ${err}`, name: to.substr(getTempPath().length) });
                    });
            })
            .catch(err => {
                return reject({ msg: `Reload copy Error: ${err}`, name: to.substr(getTempPath().length) });
            })
    });
}



function getTempPath() {
    return 'reload-temp/';
}


module.exports = {
    reload,
    reloadAll
}