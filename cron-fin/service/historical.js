const iex = require('./iex/iexaccount');

const storage = require('./util/storage');

const re = require('./util/retry');

const date = require('./util/date');

const request = require('request');

const requestClient = require('./util/request-client');

const momentBD = require('moment-business-days');

momentBD.updateLocale('us', {
    workingWeekdays: [1, 2, 3, 4, 5]
});

var failedList = [];

var newUpdated = 0;
var copyUpdated = 0;



function update(symbol) {
    return new Promise(async (resolve, reject) => {

        var file = storage.file(getPath(symbol));
        var exists = await file.exists();

        if (exists[0]) {
            // Update Copy
            updateCopy(symbol)
                .then(() => {
                    return resolve();
                }).catch(err => {
                    return reject(err);
                });
        } else {
            // Update New
            updateNew(symbol)
                .then(() => {
                    return resolve();
                }).catch(err => {
                    return reject(err);
                });
        }
    });
}



function updateNew(symbol) {
    return new Promise((resolve, reject) => {
        var client = iex.clientURL('beta', `/stock/${symbol}/chart/max`, 'json') + '&chartLast=1';

        request(client, function (error, res, body) {
            try {


                if (res && res.statusCode === 200) {

                    var json = null;

                    try {
                        json = JSON.parse(body);
                    } catch (err) {
                        return reject(`body parse error! body: ${body}`);
                    }

                    var count = 0;
                    var savedData = [];
                    if (json && json.length > 0) {
                        json.reverse();

                        for (var i = 0; i < json.length; i++) {
                            var row = json[i];
                            savedData[i] = { date: row.date, open: row.open, close: row.close, high: row.high, low: row.low };
                            count++;
                        }
                    } else {
                        return resolve();
                    }

                    var output = storage.file(getPath(symbol)).createWriteStream({
                        metadata: {
                            contentType: 'application/json',
                            metadata: {
                                last: json[0].date,
                                first: json[json.length - 1].date,
                                count: count
                            }
                        }
                    }).on('error', (err) => {
                        failedList.includes(symbol) || failedList.push(symbol);
                        return reject(`Pipe Error! Error: ${err}`);;
                    }).on('finish', data => {
                        newUpdated++;
                        return resolve();
                    });

                    output.write(JSON.stringify(savedData));
                    output.end();
                } else {
                    failedList.includes(symbol) || failedList.push(symbol);
                    return reject(`Request Error! statusCode is ${res && res.statusCode}`);
                }


            } catch (err) {

                failedList.includes(symbol) || failedList.push(symbol);
                return reject(err);

            }

        }).on('error', (err) => {

            failedList.includes(symbol) || failedList.push(symbol);
            return reject(`Request Error! ${err}`);

        });
    });
}


function updateCopy(symbol) {
    return new Promise(async (resolve, reject) => {
        try {
            var today = date.format(date.get());

            var file = storage.file(getPath(symbol));

            var data = await file.download();
            var json = JSON.parse(data.toString());
            json.reverse();

            var first = json[0].date;
            var last = json[json.length - 1].date;

            if (last >= today) return resolve();

            var diff = momentBD(today, 'YYYY-MM-DD').businessDiff(momentBD(last, 'YYYY-MM-DD'));

            if (diff >= 1) {

                var hclient = iex.clientURL('beta', `/stock/${symbol}/chart/max`, 'json') + '&chartLast=' + diff;

                var hbody = await requestClient(hclient);
                var bet = JSON.parse(hbody);

                for (var i = 0; i < bet.length; i++) {
                    var row = bet[i];
                    if (row.date > last) {
                        json.push({ date: row.date, open: row.open, close: row.close, high: row.high, low: row.low });
                    }
                }

                last = json[json.length - 1].date;
            }

            var client = iex.clientURL('stable', `/stock/${symbol}/ohlc`, 'json');
            var body = await requestClient(client);
            var ohlc = JSON.parse(body);

            var newLast = date.format(ohlc.close.time);

            var savedRow = { date: newLast, open: ohlc.open.price, close: ohlc.close.price, high: ohlc.high, low: ohlc.low };

            if (newLast === last) {
                json[json.length - 1] = savedRow
            } else {
                json.push(savedRow)
            }
            
            json.reverse();

            var output = file.createWriteStream({
                contentType: 'application/json',
                metadata: {
                    first: first,
                    last: newLast,
                    count: json.length
                }
            }).on('error', (err) => {
                failedList.includes(symbol) || failedList.push(symbol);
                return reject(`Pipe Error! Error: ${err}`);;
            }).on('finish', data => {
                copyUpdated++;
                return resolve();
            });

            output.write(JSON.stringify(json));
            output.end();
        } catch (err) {

            failedList.includes(symbol) || failedList.push(symbol);
            return reject(err);

        }
    });
}


function retry() {
    return re.retry(failedList, update, 'HISTORICAL');
}

function getPath(symbol) {
    return `historical/day/${symbol}`;
}

function getNewUpdatedCount() {
    return newUpdated;
}

function getCopyUpdatedCount() {
    return copyUpdated;
}

function init() {
    newUpdated = 0;
    copyUpdated = 0;
}


module.exports = {
    init,
    update,
    retry,
    getNewUpdatedCount,
    getCopyUpdatedCount
}




