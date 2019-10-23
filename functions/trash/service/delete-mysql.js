require('dotenv').config();

const mysql = require('mysql');

var config = {
    connectionLimit: 10,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
}

if (
    process.env.INSTANCE_CONNECTION_NAME &&
    process.env.NODE_ENV === 'production'
) {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

var pool = mysql.createPool(config);

const tableList = [
    'price', 'basic', 'valuation', 'performance', 'technical', 'financial', 
    'balancesheet', 'margins', 'cashflow', 'worth', 'her', 'growth', 'fownership', 'ownership'
]

module.exports = function (symbols) {
    return new Promise(async (resolve, reject) => {
        if (symbols && symbols.length > 0) {

            var promises = [];
            var escapedSymbols = symbols.map(v => `'${v}'`);
            tableList.forEach((v, i) => {
                var q = ` delete from ${v} where ticker in (${escapedSymbols.join(',').toString()}) `;
                promises.push(query(q)
                    .catch(error => console.error(error)));
            });

            await Promise.all(promises);

            return resolve();
        } else {
            return reject(`delte-mysql: symbols empty error!`);
        }
    });
}


function query(q) {
    return new Promise((resolve, reject) => {
        pool.query(q, function (error, results, fields) {
            if (error) return reject(error);
            console.log(`Success! ${q}`);
            resolve();
        });
    })
}