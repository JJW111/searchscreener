'use strict'

const express = require('express');

const router = express.Router();

const doAsync = require('../lib/do-async');

const main = require('../service/main-service');

router.get('/', doAsync(async (req, res) => {
    var mainData = await main();
    res.render('index', { main: mainData });
}));

module.exports = router;
