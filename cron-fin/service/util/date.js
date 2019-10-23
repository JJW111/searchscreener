'use strict'

const dateformat = require('dateformat');

const f = 'yyyy-mm-dd';

function getDate(date) {
    var d = null;

    if (date)
        d = new Date(date);
    else
        d = new Date();

    d.setHours(d.getHours() - 4);
    return d;
}

function get(i) {
    i = i || 0;
    var d = getDate();
    d.setDate(d.getDate() + (i));
    return d;
}

function format(d, _f = f) {
    return dateformat(new Date(d), _f);
}

module.exports = {
    get,
    getDate,
    format
}