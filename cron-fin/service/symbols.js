'use strict'

const iex = require('./iex/iexaccount');

const storage = require('./util/storage');

const requestClient = require('./util/request-client');

const csv = require('fast-csv');

const { parse } = require('json2csv');

const ctj = require('csvtojson');


/* 심볼은 알파벳만 허용된다. */
var regSymbolOnlyAlpha = /^[A-Z]+$/;



function update() {
    return new Promise(async (resolve, reject) => {
        try {
            var client = iex.clientURL('beta', `/ref-data/symbols`, 'json');
            var file = storage.file(getPath());

            var data = await requestClient(client);
            var json = JSON.parse(data);

            var n = [];
            var res = [];
            var count = 0;

            for (var i = 0; i < json.length; i++) {
                var row = json[i];
                if (!regSymbolOnlyAlpha.exec(row.symbol)) continue;
                if (row.exchange === 'IEXG') continue;
                n.push(row.symbol);
                res.push(row);
                count++;
            }

            if (!(res.length > 0)) throw new Error(`res.length is zero`);

            var exists = await file.exists();
            if (exists[0]) {
                var data2 = await file.download();
                var json2 = await ctj().fromString(data2[0].toString());

                var o = [];

                for (var i = 0; i < json2.length; i++) {
                    var row = json2[i];
                    o.push(row.symbol);
                }

                // excludes 목록 생성
                var diffList = array_diff(o, n);
                if (diffList.length > 0) {
                    var excOutput = storage.file(getDeleteListPath()).createWriteStream({
                        metadata: {
                            contentType: 'text/plain'
                        }
                    });
                    excOutput.write(diffList.join(',').toString());
                    excOutput.end();
                }
            }

            var output = file.createWriteStream({
                metadata: {
                    contentType: 'text/csv'
                }
            });

            var fields = Object.keys(res[0]);

            const opts = { fields };

            const csvString = parse(res, opts);

            output.write(csvString);
            output.end();

            resolve({ total: count });
        } catch (err) {
            reject(err);
        }
    });
}




function array_diff(a, b) {
    var tmp = {}, res = [];
    for (var i = 0; i < a.length; i++) tmp[a[i]] = 1;
    for (var i = 0; i < b.length; i++) { if (tmp[b[i]]) delete tmp[b[i]]; }
    for (var k in tmp) res.push(k);
    return res;
}



function stream() {
    return new Promise(async (resolve, reject) => {
        try {
            var file = storage.bucket().file(getPath());
            var exists = await file.exists();

            if (exists[0]) {
                var _stream = csv.fromStream(file.createReadStream(), { headers: true, delimiter: ',' });
                resolve(_stream);
            } else {
                reject(`SYMBOLS File ${getPath()} 가 존재하지 않습니다.`);
            }
        } catch (e) {
            reject(e);
        }
    });
}



function getDeleteListPath() {
    return `symbols-delete-list`;
}


function getPath() {
    return `symbols`;
}



function getHeader() {
    return `symbol,exchange`;
}



module.exports = {
    update,
    stream
}

