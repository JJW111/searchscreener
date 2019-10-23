'use strict'

const iex = require('./iex/iexaccount');

var storage = require('./util/storage');

const re = require('./util/retry');

var request = require('request');

var failedList = [];

var updated = 0;

function update(symbol) {
    return new Promise((resolve, reject) => {
        var client = iex.clientURL('stable', `/stock/${symbol}/stats`, 'json');

        var req = request(client)
            .on('response', res => {


                if (res && res.statusCode === 200) {

                    var output = storage.file(getPath(symbol)).createWriteStream({
                        metadata: {
                            contentType: 'application/json'
                        }
                    }).on('error', (err) => {
                        failedList.includes(symbol) || failedList.push(symbol);
                        return reject(`Pipe Error! Error: ${err}`);;
                    }).on('finish', () => {
                        updated++;
                        return resolve();
                    });

                    req.pipe(output);


                } else {
                    failedList.includes(symbol) || failedList.push(symbol);
                    return reject(`Request Error! statusCode is ${res && res.statusCode}`);
                }


            }).on('error', (err) => {

                failedList.includes(symbol) || failedList.push(symbol);
                return reject(`Request Error! ${err}`);
                
            });
    });
}


function retry() {
    return re.retry(failedList, update, 'KEY STATS');
}


function getPath(symbol) {
    return `key-stats/${symbol}`;
}

function init() {
    updated = 0;
}

function getUpdated() {
    return updated;
}


module.exports = {
    update,
    retry,
    init,
    getUpdated
}
