'use strict'

process.env.TZ = 'America/Detroit'; // set Date time zone

const dateformat = require('dateformat');

const f = 'yyyy-mm-dd';

function get(i) {
    i = i || 0;
    let d = new Date();
    d.setDate(d.getDate() + (i));
    return dateformat(d, f);
}

function format(d, _f = f) {
    return dateformat(new Date(d), _f);
}

module.exports = {
    get,
    format
}