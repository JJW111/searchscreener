'use strict'

var i18n = require('i18n');

var support = ['en', 'ko'];

i18n.configure({
    locales: support,
    directory: __dirname + '/locale',
    defaultLocale: 'en',
    cookie: 'lang',
    queryParameter: 'lang',
    objectNotation: true,
});

module.exports = (req, res, next) => {
    i18n.init(req, res);
    return next();
}
