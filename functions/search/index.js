const merge = require('lodash.merge');

const company = require('./service/company');

const keystats = require('./service/keystats');

const historical = require('./service/historical-day');

const yahooFinance = require('./service/yahoo-finance');

const companyPath = 'company/';

const keystatsPath = 'key-stats/';

const histocialDayPath = 'historical/day/';

const yahooFinancePath = 'yahoo-finance/';

const sql = require('./service/sql');


exports.update = async (file, context, callback) => {
    const match = file.name.match(/^.*[\\\/]/);
    const path = match && match[0];


    const ticker = file.name.replace(/^.*[\\\/]/, '');
    var docData = {};


    switch (path) {
        case companyPath:
            /* company */
            try {
                var data = await company.get(file.name);
                merge(docData, data);
            } catch (err) {
                console.error(`${ticker} - Company Error! ${err}`);
            }

            break;
        case keystatsPath:
            /* key stats */
            try {
                var data = await keystats.get(file.name);
                merge(docData, data);
            } catch (err) {
                console.error(`${ticker} - Key Stats Error! ${err}`);
            }

            break;
        case histocialDayPath:
            /* historical day */
            try {
                var data = await historical.get(file.name, ticker);
                merge(docData, data);
            } catch (err) {
                console.error(`${ticker} - Historical Day Error! ${err}`);
            }
            
            break;
        case yahooFinancePath:
            /* yahoo finance */
            try {
                var data = await yahooFinance.get(file.name);
                merge(docData, data);
            } catch (err) {
                console.error(`${ticker} - Yahoo Finance Error! ${err}`);
            }

            break;
        default:
            break;
    }


    if (docData && Object.keys(docData).length > 0) {
        // For Mysql
        for (var table in docData) {
            try {
                await sql.update(ticker, table, docData[table]);
                console.log(`${file.name} - ${table} update complete`);
            } catch (err) {
                console.error(`${file.name} - ${table} Error: ${err}`);
            }
        }
    }

    callback();
};
