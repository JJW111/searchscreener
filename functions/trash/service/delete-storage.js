const storage = require('./util/storage');

const pathList = [
    'yahoo-finance/', 'company/', 'key-stats/', 'historical/day/'
]

module.exports = function (symbols) {
    return new Promise(async (resolve, reject) => {
        if (symbols && symbols.length > 0) {

            var promises = [];

            symbols.forEach((v, i) => {
                pathList.forEach((v2, j) => {
                    promises.push(exists_delete(v2 + v).catch(err => { }));
                })
            })

            await Promise.all(promises);

            return resolve();
        } else {
            return reject(`delete-storage: symbols empty error!`);
        }

    });
}


function exists_delete(path) {
    return new Promise((resolve, reject) => {
        var file = storage.file(path);
        file.exists()
            .then(data => {
                var exists = data[0];

                if (exists) {

                    file.delete()
                        .then(() => {
                            console.log(`${path} is deleted.`);
                            return resolve();
                        })
                        .catch(err => {
                            console.error(`${path} Error! ${err}`);
                            return reject(err);
                        })

                } else {

                    return resolve();

                }

            });
    });
}