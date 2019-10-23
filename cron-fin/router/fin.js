'use strict'

var express = require('express');

var router = express.Router();

const wait = require('../service/util/wait');

const MAX_RETRY_NUMBER = 3;



/** App engine Cron 외 접근시 401 상태코드 반환 */
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (req.get('X-Appengine-Cron') !== 'true' && ip !== '0.1.0.1') {
        res
            .status(401)
            .end();
    } else {
        next();
    }
})



/* symbols 업데이트 */
router.get('/symbols', (req, res) => {
    var symbols = require('../service/symbols');

    symbols
        .update()
        .then(data => {
            console.log(`SYMBOLS update finish! total: ${data.total}`);
        })
        .catch(err => {
            console.error(`SYMBOLS Update Error: ${err}`);
        });

    res.status(200).end();
});




/* Yahoo Finance 업데이트 */
router.get('/yahoo-finance', (req, res) => {
    var symbols = require('../service/symbols');

    symbols
        .stream()
        .then(stream => {
            var yahooFinance = require('../service/yahoo-finance');
            yahooFinance.init();
            var count = 0;
            var promises = [];
            console.time('YAHOO-FINANCE  - process time');

            stream
                .on('data', async row => {
                    stream.pause();
                    if (count++ % 500 === 0) {
                        await Promise.all(promises);
                        promises.length = 0;
                    }
                    promises.push(yahooFinance.update(row.symbol).catch(err => console.error(`Yahoo Finance: [${row.symbol}] ${err}`)));
                    stream.resume();
                })
                .on('end', async () => {
                    await Promise.all(promises);

                    for (var i = 0; i < MAX_RETRY_NUMBER; i++) {
                        try {
                            await yahooFinance.retry();
                            break;
                        } catch (err) {
                            console.error(`Yahoo Finance: ${err}`);
                        }
                    }

                    console.log(`Yahoo Finance updated ${yahooFinance.getUpdated()}/${count}`);
                    console.timeEnd('YAHOO-FINANCE  - process time');
                });
        })
        .catch(err => {
            console.error(`Yahoo Finance Update Error! ${err}`);
        })

    res.status(200).end();
})



/* HISTORICAL NEW UPDATE*/
router.get('/historical', (req, res) => {
    var symbols = require('../service/symbols');

    symbols
        .stream()
        .then(stream => {
            var historical = require('../service/historical');
            historical.init();
            var count = 0;
            var promises = [];
            console.time('HISTORICAL - process time');

            stream
                .on('data', row => {
                    count++;
                    stream.pause();
                    promises.push(historical.update(row.symbol).catch(err => console.error(`HISTORICAL: [${row.symbol}] ${err}`)));
                    stream.resume();
                })
                .on('end', async () => {
                    await Promise.all(promises);

                    for (var i = 0; i < MAX_RETRY_NUMBER; i++) {
                        try {
                            await historical.retry();
                            break;
                        } catch (err) {
                            console.error(`HISTORICAL: ${err}`);
                        }
                    }

                    console.log(`HISTORICAL New Updated ${historical.getNewUpdatedCount()}/${count}`);
                    console.log(`HISTORICAL Copy Updated ${historical.getCopyUpdatedCount()}/${count}`);
                    console.timeEnd('HISTORICAL - process time');
                });
        })
        .catch(err => {
            console.error(`HISTORICAL Update Error!`, err);
        })

    res.status(200).end();
});





/* key stats 업데이트 */
router.get('/keystats', (req, res) => {
    var symbols = require('../service/symbols');

    symbols
        .stream()
        .then(stream => {
            var keyStats = require('../service/key-stats');
            keyStats.init();
            var count = 0;
            var promises = [];
            console.time('KEY STATS - process time');

            stream
                .on('data', row => {
                    stream.pause();
                    count++;
                    promises.push(keyStats.update(row.symbol).catch(err => console.error(`KEY STATS: [${row.symbol}] ${err}`)));
                    stream.resume();
                })
                .on('end', async () => {
                    await Promise.all(promises);

                    for (var i = 0; i < MAX_RETRY_NUMBER; i++) {
                        try {
                            await keyStats.retry();
                            break;
                        } catch (err) {
                            console.error(`KEY STATS: ${err}`);
                        }
                    }

                    console.log(`KEY STATS: Total ${keyStats.getUpdated()}/${count}`);
                    console.timeEnd('KEY STATS - process time');
                });
        })
        .catch(err => {
            console.error(`KEY STATS: Update Error! ${err}`);
        })

    res.status(200).end();
})




/* company 업데이트 */
router.get('/company', (req, res) => {
    var symbols = require('../service/symbols');

    symbols
        .stream()
        .then(stream => {
            var company = require('../service/company');
            company.init();
            var count = 0;
            var promises = [];
            console.time('COMPANY - process time');

            stream
                .on('data', row => {
                    stream.pause();
                    count++;
                    promises.push(company.update(row.symbol, row.type).catch(err => console.error(`COMPANY: [${row.symbol}] ${err}`)));
                    stream.resume();
                })
                .on('end', async () => {
                    await Promise.all(promises);

                    for (var i = 0; i < MAX_RETRY_NUMBER; i++) {
                        try {
                            await company.retry();
                            break;
                        } catch (err) {
                            console.error(`COMPANY: ${err}`);
                        }
                    }

                    console.log(`COMPANY: Updated ${company.getUpdated()}/${count}`);
                    console.timeEnd('COMPANY - process time');

                    try {
                        await company.writeExchange();
                        console.log(`CATEGORY: Exchange Updated`);
                    } catch (err) {
                        console.error(`CATEGORY - Exchange: Error! ${err}`);
                    }

                    try {
                        await company.writeIndustry();
                        console.log(`CATEGORY: Industry Updated`);
                    } catch (err) {
                        console.error(`CATEGORY - Industry: Error! ${err}`);
                    }

                    try {
                        await company.writeSector();
                        console.log(`CATEGORY: Sector Updated`);
                    } catch (err) {
                        console.error(`CATEGORY - Sector: Error! ${err}`);
                    }
                });
        })
        .catch(err => {
            console.error(`COMPANY: Update Error! ${err}`);
        })

    res.status(200).end();
})






module.exports = router;
