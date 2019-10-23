function retry(failedList, callback, group) {
    return new Promise(async (resolve, reject) => {
        if (failedList.length > 0) {
            var list = JSON.parse(JSON.stringify(failedList));
            failedList.length = 0;

            console.log(`${group}: Some file is failed.`);
            console.log(`${group}: Retry List ${list.join(',').toString()}`);

            var promises = [];
            var isRetry = false;

            for (var i = 0; i < list.length; i++) {
                var symbol = list[i];
                promises.push(
                    callback(symbol)
                        .catch(err => {
                            console.error(`${group}: Retry Error! ${err}`);
                            isRetry = true;
                        }));
            }

            await Promise.all(promises);

            if (isRetry) {
                return reject(`${group}: Retry is failed. Failed list: ${failedList.join(',').toString()}`);
            } else {
                return resolve();
            }
        } else {
            console.log(`${group}: Retry is none`);
            return resolve();
        }
    });
}



module.exports = {
    retry
}