'use strict'

var express = require('express');

var router = express.Router();

var service = require('../service/backup-service');



/** App engine Cron 외 접근시 401 상태코드 반환 */
router.use((req, res, next) => {
    if (req.get('X-Appengine-Cron') !== 'true') {
        res
            .status(401)
            .end();
    } else {
        next();
    }
})



/* stock.searchscreener.com 버킷 백업 */
router.get('/stock', (req, res) => {
    var from = 'stock.searchscreener.com';
    var to = 'backup.stock.searchscreener.com';

    service
        .backup(from, to)
        .then(data => {
            console.log(`Bucket backup completed. from ${from} to ${to}. ${data.count} files backed up.`);
        })
        .catch(err => {
            console.error(`Bucket backup failed. from ${from} to ${to}. ${err}`);
        });

    res.status(200).end();
})



module.exports = router;
