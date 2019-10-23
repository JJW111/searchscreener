'use strict'

const { validateJson, validateDateFormat } = require('../lib/validate');

const storage = require('./util/storage');

const moment = require('moment');

function get(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            var docData = {};
            docData.basic = {};
            docData.valuation = {};
            docData.financial = {};
            docData.performance = {};
            docData.technical = {};

            var data = await storage.file(fileName).download();
            var d = null;
            if (typeof data[0] !== 'string') {
                d = data[0].toString();
            } else {
                d = data;
            }

            var json = JSON.parse(d);
            var row = validateJson(json);

            docData.basic[`avg10Volume`] = row.avg10Volume;
            docData.basic[`avg30Volume`] = row.avg30Volume;

            docData.valuation[`marketcap`] = row.marketcap;
            docData.valuation[`sharesOutstanding`] = row.sharesOutstanding;
            docData.valuation[`employees`] = row.employees;

            docData.financial[`pe`] = row.peRatio;
            docData.financial[`dividendYield`] = row.dividendYield * 100;
            docData.financial[`ttmDividendRate`] = row.ttmDividendRate;
            docData.financial[`beta`] = row.beta;

            var nextEarningsDate = validateDateFormat(row.nextEarningsDate);
            var nextDividendDate = validateDateFormat(row.nextDividendDate);
            var exDividendDate = validateDateFormat(row.exDividendDate);

            docData.financial[`nextEarningsDate`] = nextEarningsDate;
            docData.financial[`nextDividendDate`] = nextDividendDate;
            docData.financial[`exDividendDate`] = exDividendDate;

            let startDate = moment(new Date(), 'YYYY-MM-DD');
            if (nextEarningsDate) {
                let endDate = moment(nextEarningsDate, 'YYYY-MM-DD');
                let diff = endDate.diff(startDate, 'day');
                if (diff >= 0) {
                    if (diff >= 0 && diff < 7) {
                        docData.financial[`ned`] = '1w';
                    } else {
                        let diff = endDate.diff(startDate, 'month');
                        if (diff === 0) {
                            docData.financial[`ned`] = '1m';
                        } else if (diff > 0 && diff < 3) {
                            docData.financial[`ned`] = '3m';
                        } else if (diff >= 3 && diff < 6) {
                            docData.financial[`ned`] = '6m';
                        } else {
                            docData.financial[`ned`] = 'g6m';
                        }
                    }
                } else {
                    docData.financial[`ned`] = null;
                }
            }

            if (nextDividendDate) {
                let endDate = moment(nextDividendDate, 'YYYY-MM-DD');
                let diff = endDate.diff(startDate, 'day');

                if (diff >= 0) {
                    if (diff >= 0 && diff < 7) {
                        docData.financial[`ndd`] = '1w';
                    } else {
                        let diff = endDate.diff(startDate, 'month');
                        if (diff === 0) {
                            docData.financial[`ndd`] = '1m';
                        } else if (diff > 0 && diff < 3) {
                            docData.financial[`ndd`] = '3m';
                        } else if (diff >= 3 && diff < 6) {
                            docData.financial[`ndd`] = '6m';
                        } else {
                            docData.financial[`ndd`] = 'g6m';
                        }
                    }
                } else {
                    docData.financial[`ndd`] = null;
                }
            }

            if (exDividendDate) {
                let endDate = moment(exDividendDate, 'YYYY-MM-DD');
                let diff = endDate.diff(startDate, 'day');
                if (diff >= 0) {
                    if (diff >= 0 && diff < 7) {
                        docData.financial[`edd`] = '1w';
                    } else {
                        let diff = endDate.diff(startDate, 'month');
                        if (diff === 0) {
                            docData.financial[`edd`] = '1m';
                        } else if (diff > 0 && diff < 3) {
                            docData.financial[`edd`] = '3m';
                        } else if (diff >= 3 && diff < 6) {
                            docData.financial[`edd`] = '6m';
                        } else {
                            docData.financial[`edd`] = 'g6m';
                        }
                    }
                } else {
                    docData.financial[`edd`] = null;
                }
            }


            docData.performance[`d5cp`] = row.day5ChangePercent && (row.day5ChangePercent * 100) || null;
            docData.performance[`d30cp`] = row.day30ChangePercent && (row.day30ChangePercent * 100) || null;
            docData.performance[`m1cp`] = row.month1ChangePercent && (row.month1ChangePercent * 100) || null;
            docData.performance[`m3cp`] = row.month3ChangePercent && (row.month3ChangePercent * 100) || null;
            docData.performance[`m6cp`] = row.month6ChangePercent && (row.month6ChangePercent * 100) || null;
            docData.performance[`ytdcp`] = row.ytdChangePercent && (row.ytdChangePercent * 100) || null;
            docData.performance[`y1cp`] = row.year1ChangePercent && (row.year1ChangePercent * 100) || null;
            docData.performance[`y2cp`] = row.year2ChangePercent && (row.year2ChangePercent * 100) || null;
            docData.performance[`y5cp`] = row.year5ChangePercent && (row.year5ChangePercent * 100) || null;

            docData.technical[`pw52h`] = row.week52high;
            docData.technical[`pw52l`] = row.week52low;

            resolve(docData);
        } catch (err) {
            reject(err);
        }
    });
}



module.exports = {
    get
}