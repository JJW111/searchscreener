const mysql = require('mysql');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

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

const pool = mysql.createPool(config);

function getPool() {
    return pool;
}

module.exports = {
    getPool
}