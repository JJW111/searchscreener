'use strict'

var csv = require('fast-csv');

var request = require('request-promise-native');

var mode = {
    BUFFER: 0,
    WRITE: 1
}

function context(stream, onFn, options, _mode) {
    return new Promise((resolve, reject) => {
        var eh = require('./error-handle');
        var buffArr = null;

        if (_mode == mode.BUFFER)
            buffArr = [];

        if (!options) options = { headers: true, delimiter: ',' };

        var csvStream = csv(options);

        onFn.validate && csvStream.validate(row => {
            return eh.eventerr(
                () => {
                    return onFn.validate(row);
                }, e => { });
        });
        onFn.transform && csvStream.transform(row => {
            return eh.eventerr(
                () => {
                    return onFn.transform(row);
                }, e => { });
        });
        onFn.data && csvStream.on('data', row => {
            eh.eventerr(
                () => {
                    var data = onFn.data(row);
                    if (data)
                        switch (_mode) {
                            case mode.BUFFER:
                                data && buffArr.push(data);
                                break;
                            case mode.WRITE:
                                data && stream.output && stream.output.write(data);
                                break;
                            default:
                                break;
                        }
                }, e => { });
        });
        csvStream.on('end', () => {
            onFn.last && onFn.last(stream.input, stream.output);
            stream.input && (stream.input.end && stream.input.end());
            stream.output && (stream.output.end && stream.output.end());
            if (eh.hasError()) {
                reject(eh.getError());
            } else {
                switch (_mode) {
                    case mode.BUFFER:
                        resolve(buffArr);
                        break;
                    case mode.WRITE:
                        resolve();
                        break;
                    default:
                        resolve();
                        break;
                }
            }
        });
        csvStream.on('error', err => {
            reject(err);
        });

        stream.input && stream.input.pipe(csvStream);
    })
}



function get(input, onFn, options) {
    return new Promise(async (resolve, reject) => {
        try {
            var data = await context({ input: input }, onFn, options, mode.BUFFER)
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}



function getRequest(client, onFn, options) {
    return new Promise(async (resolve, reject) => {
        try {
            var req = request(client);

            req.catch(err => {
                reject(err.message);
            });

            var data = await context({ input: req }, onFn, options, mode.BUFFER)
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}



function pipe(input, output, onFn, options) {
    return context({ input: input, output: output }, onFn, options, mode.WRITE);
}



function pipeRequest(client, output, onFn, options) {
    return new Promise(async (resolve, reject) => {
        try {
            var req = request(client);

            req.catch(err => {
                reject(err.message);
            });

            var data = await context({ input: req, output: output }, onFn, options, mode.WRITE)
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    get,
    getRequest,
    pipe,
    pipeRequest
}