'use strict'

var express = require('express');

var router = express.Router();


/** App engine Cron 외 접근시 401 상태코드 반환 */
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (req.get('X-Appengine-Cron') !== 'true' && ip !== '0.1.0.1') {
        res
            .status(401)
            .end();
    } else {
        next();
    }
})



/* main 업데이트 */
router.get('/main', (req, res) => {
    var main = require('../service/main');

    main
        .update()
        .then(data => {
            console.log(`Main update finish!`);
        })
        .catch(err => {
            console.error(`Main Update Error: ${err}`);
        });
        
    res.status(200).end();
});




module.exports = router;
