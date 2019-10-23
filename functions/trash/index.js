const deleteList = require('./service/delete-list');

const deleteStorage = require('./service/delete-storage');

const deleteMysql = require('./service/delete-mysql');


exports.trash = async (file, context, callback) => {
    if (file.name === 'symbols-delete-list') {
        var symbols = null;

        try {
            symbols = await deleteList(file.name);
        } catch (err) {
            console.error(`getDeleteList Error! ${err}`);
            return callback();
        }

        try {
            await deleteStorage(symbols);
        } catch (err) {
            console.error(`deleteStorage Error! ${err}`);
        }

        try {
            await deleteMysql(symbols);
        } catch (err) {
            console.error(`deleteMysql Error! ${err}`);
        }
    }

    callback();
};
