require('dotenv').config();

const mysql = require('mysql');

var config = {
    connectionLimit: 5,
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

function query(q) {
    return new Promise((resolve, reject) => {
        pool.query(q, function (error, results, fields) {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

module.exports = {
    getPool,
    query
}