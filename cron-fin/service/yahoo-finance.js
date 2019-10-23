require('dotenv').config();

const api_key = process.env.RAPID_API_KEY;

var storage = require('./util/storage');

const re = require('./util/retry');

var request = require('request');

const date = require('./util/date');

var failedList = [];

var updated = 0;


function update(symbol) {
    return new Promise(async (resolve, reject) => {
        var file = storage.file(getPath(symbol));
        var exists = await file.exists();

        if (exists[0]) {
            var data = await file.getMetadata();
            var today = date.getDate(new Date());
            var created = date.getDate(data[0].timeCreated);
            
            if (today.getMonth() === created.getMonth()) {
                return resolve();
            }
        }

        var options = {
            url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/get-detail?region=US&lang=en&symbol=" + symbol,
            headers: {
                "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
                "X-RapidAPI-Key": api_key
            }
        };

        var req = request(options)
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
    return re.retry(failedList, update, 'Yahoo Finance');
}

function getPath(symbol) {
    return `yahoo-finance/${symbol}`;
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
