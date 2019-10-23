'use strict'

var express = require('express');

var router = express.Router();

var doAsync = require('../lib/do-async');

var view = require('../service/view-service');

router.get('/stock', doAsync(async (req, res) => {
    var ticker = req.query.ticker || '';
    var v = await view.get(ticker);
    
    if (!v) {
        v = {};
    }
    console.log(v);
    res.render('view/stock', { ticker: ticker, view: v });
}));

module.exports = router;