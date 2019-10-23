const iex = require('./iex/iexaccount');

const storage = require('./util/storage');

const re = require('./util/retry');

const request = require('request');

var sector = [];
var industry = [];
var exchange = [];

var failedList = [];

var updated = 0;

function update(symbol, type) {
    return new Promise((resolve, reject) => {
        var client = iex.clientURL('stable', `/stock/${symbol}/company`, 'json');

        request(client, function (error, res, body) {


            if (res.statusCode === 200) {

                var output = storage.file(getPath(symbol)).createWriteStream({
                    metadata: {
                        contentType: 'application/json'
                    }
                }).on('error', (err) => {
                    failedList.push({ symbol: symbol, type: type });
                    return reject(`Pipe Error! Error: ${err}`);;
                }).on('finish', data => {
                    updated++;
                    return resolve();
                });

                try {
                    var row = JSON.parse(body);
                } catch (err) {
                    return reject(`body parse error! body: ${body}`);
                }

                row.type = type || '';

                output.write(JSON.stringify(row));
                output.end();

                row.sector && (sector.includes(row.sector) || sector.push(row.sector));
                row.industry && (industry.includes(row.industry) || industry.push(row.industry));
                row.exchange && (exchange.includes(row.exchange) || exchange.push(row.exchange));

            } else {
                failedList.push({ symbol: symbol, type: type });
                return reject(`Request Error! statusCode is ${res.statusCode}`);
            }


        }).on('error', (err) => {

            failedList.push({ symbol: symbol, type: type });
            return reject(`Request Error! ${err}`);

        });
    });
}



function writeExchange() {
    return new Promise((resolve, reject) => {
        if (exchange.length == 0)
            throw new Error(`exchange length is zero`);

        var outputFile = storage.file(getCategoryPath(`exchange`));
        var output = outputFile.createWriteStream({
            metadata: {
                contentType: 'text/plain'
            }
        }).on('error', (err) => {
            return reject(err);
        }).on('finish', () => {
            return resolve();
        });

        output.write(exchange.join(`\r\n`).toString());
        output.end();
    });
}


function writeSector() {
    return new Promise((resolve, reject) => {
        if (sector.length == 0)
            throw new Error(`sector length is zero`);

        var outputFile = storage.file(getCategoryPath(`sector`));
        var output = outputFile.createWriteStream({
            metadata: {
                contentType: 'text/plain'
            }
        }).on('error', (err) => {
            return reject(err);
        }).on('finish', () => {
            return resolve();
        });

        output.write(sector.join(`\r\n`).toString());
        output.end();
    });
}


function writeIndustry() {
    return new Promise((resolve, reject) => {
        if (industry.length == 0)
            throw new Error(`industry length is zero`);

        var outputFile = storage.file(getCategoryPath(`industry`));
        var output = outputFile.createWriteStream({
            metadata: {
                contentType: 'text/plain'
            }
        }).on('error', (err) => {
            return reject(err);
        }).on('finish', () => {
            return resolve();
        });

        output.write(industry.join(`\r\n`).toString());
        output.end();
    });
}


function retry() {
    return new Promise(async (resolve, reject) => {
        if (failedList.length > 0) {
            var list = JSON.parse(JSON.stringify(failedList));
            failedList.length = 0;

            var symbolList = [];
            for (var i = 0; i < list.length; i++) {
                symbolList.push(list[i].symbol);
            }

            console.log(`COMPANY: Some file is failed.`);
            console.log(`COMPANY: Retry List ${symbolList.join(',').toString()}`);

            var promises = [];
            var isRetry = false;

            for (var i = 0; i < list.length; i++) {
                var row = list[i];
                promises.push(
                    update(row.symbol, row.type)
                        .catch(err => {
                            console.error(`COMPANY: Retry Error! ${err}`);
                            isRetry = true;
                        }));
            }

            await Promise.all(promises);

            if (isRetry) {
                return reject(`COMPANY: Retry is failed. Failed list: ${failedList.join(',').toString()}`);
            } else {
                return resolve();
            }
        } else {
            console.log(`COMPANY: Retry is none`);
            return resolve();
        }
    });
}


function getCategoryPath(category) {
    return `category/${category}`;
}


function getPath(symbol) {
    return `company/${symbol}`;
}


function init() {
    updated = 0;
}

function getUpdated() {
    return updated;
}


module.exports = {
    update,
    writeExchange,
    writeSector,
    writeIndustry,
    retry,
    init,
    getUpdated
}
