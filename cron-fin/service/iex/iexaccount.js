'use strict'

require('dotenv').config();

const baseURL = "https://cloud.iexapis.com/";

const sk = process.env.IEXCLOUD_SECRET_KEY;

const token = `?token=${sk}`;

exports.clientURL = (version, path, format = 'json') => {
    if (format !== 'csv') format = 'json';
    return `${baseURL}${version}${path}${token}&format=${format}`;
}