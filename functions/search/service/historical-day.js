'use strict'

const { validateJson, validateDateFormat } = require('../lib/validate');

const storage = require('./util/storage');

const sql = require('./sql');

const pool = sql.getPool();

function get(fileName, ticker) {
    return new Promise(async (resolve, reject) => {
        try {
            var docData = {};
            docData.price = {};
            docData.technical = {};

            var data = await storage.file(fileName).download();
            var d = null;
            if (typeof data[0] !== 'string') {
                d = data[0].toString();
            } else {
                d = data;
            }
            
            var row = JSON.parse(d);

            docData.price.date = row[0].date;
            docData.price.open = row[0].open;
            docData.price.close = row[0].close;
            docData.price.high = row[0].high;
            docData.price.low = row[0].low;
            
            if (row.length > 1) {
                if (row[0].open && row[1].close) {
                    docData.price.gapPercent = ((row[0].open - row[1].close) / row[1].close * 100).toFixed(2);
                } else {
                    docData.price.gapPercent = null;
                }

                if (row[0].close && row[1].close) {
                    docData.price.chang = row[0].close - row[1].close;
                    docData.price.changPercent = (docData.price.chang / row[1].close * 100).toFixed(2);
                } else {
                    docData.price.chang = null;
                    docData.price.changPercent = null;
                }
            } else {
                docData.price.gapPercent = null;
                docData.price.chang = null
                docData.price.changPercent = null
            }

            
            var q = `SELECT pw52h, pw52l from technical where ticker = '${ticker}'`;
            pool.query(q, function (error, results, fields) {
                if (error) {
                    docData.technical.w52c = null;
                    docData.technical.w52h = null;
                    docData.technical.w52l = null;
                    docData.technical.w52hp = null;
                    docData.technical.w52lp = null;
                    docData.technical.newHigh = null;
                    docData.technical.newLow = null;
                } else {
                    var preWeek52high = results[0].pw52h;
                    var preWeek52low = results[0].pw52l;

                    if (preWeek52high && row[0].high) {
                        docData.technical.w52h = (row[0].high > preWeek52high) && row[0].high || preWeek52high;
                        docData.technical.newHigh = row[0].high > preWeek52high;

                        if (row[0].close) {
                            docData.technical.w52hp = ((docData.technical.w52h - row[0].close) / row[0].close * 100).toFixed(2);
                        } else {
                            docData.technical.w52hp = null;
                        }
                    } else {
                        docData.technical.w52h = null;
                        docData.technical.w52hp = null;
                        docData.technical.newHigh = null;
                    }

                    if (preWeek52low && row[0].low) {
                        docData.technical.w52l = (row[0].low < preWeek52low) && row[0].low || preWeek52low;
                        docData.technical.newLow = row[0].low < preWeek52low;

                        if (row[0].close) {
                            docData.technical.w52lp = ((docData.technical.w52l - row[0].close) / row[0].close * 100).toFixed(2);
                        } else {
                            docData.technical.w52lp = null;
                        }
                    } else {
                        docData.technical.w52l = null;
                        docData.technical.newLow = null;
                        docData.technical.w52lp = null;
                    }

                    if (docData.technical.w52h && docData.technical.w52l) {
                        docData.technical.w52c = docData.technical.w52h - docData.technical.w52l;
                    } else {
                        docData.technical.w52c = null;
                    }

                }
                resolve(docData);
            });
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    get
}