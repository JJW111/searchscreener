const storage = require('./util/storage');

module.exports = function (name) {
    return new Promise(async (resolve, reject) => {
        try {
            var data = await storage.file(name).download();
            var list = data[0].toString().split(',');
            resolve(list);
        } catch (err) {
            reject(err);
        }
    });
}