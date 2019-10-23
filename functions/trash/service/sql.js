require('dotenv').config();

const mysql = require('mysql');

var config = {
    connectionLimit: 100,
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


function getPool() {
    return pool;
}

function update(ticker, table, data) {
    return new Promise(async (resolve, reject) => {
        try {
            if (Object.keys(data).length > 0) {
                var columns = [];
                var values = [];

                for (var column in data) {
                    var v = data[column];
                    columns.push(column);
                    values.push(v);
                }

                if (columns.length > 0 && values.length > 0) {
                    columns.push('ticker');
                    columns.push('updated');
                    values.push(ticker);
                    values.push(new Date());

                    var pair = [];
                    var escapedValues = [];
                    for (var i = 0; i < columns.length; i++) {
                        var value = mysql.escape(values[i]);
                        value = value === 'NaN' ? 'null' : value;
                        escapedValues.push(value);
                        pair.push(columns[i] + '=' + value);
                    }

                    var q = `INSERT INTO ${table} (${columns.join(',').toString()}) VALUES (${escapedValues.join(',').toString()}) ON DUPLICATE KEY UPDATE ${pair.join(',').toString()}`;
                    await pquery(q);
                }
            }

            return resolve();
        } catch (err) {
            return reject(err);
        }
    });
}

function pquery(q) {
    return new Promise((resolve, reject) => {
        pool.query(q, function (error, results, fields) {
            if (error) return reject(error);
            resolve();
        });
    });
}

module.exports = {
    update,
    getPool
}