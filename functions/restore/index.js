'use strict'


const service = require('./service/restore-service');

const token = process.env.TOKEN;



exports.restore = async (req, res) => {
    var _token = req.query.token;
    var message = '';

    if (!token || token !== _token) {
        res.status(403).end();
        return;
    }

    var fromPath = req.query.fromPath || '';
    var fromBucket = req.query.fromBucket;
    var toPath = req.query.toPath || '';
    var toBucket = req.query.toBucket;

    if (fromBucket && fromPath && toBucket) {
        try {
            await service.restore(fromBucket, fromPath, toBucket, toPath);
            res.status(200);
            message = `${fromBucket}/${fromPath} to ${toBucket}/${toPath} restore complete.`;
        } catch (err) {
            res.status(500);
            message = err.message || err;
        }
    } else {
        message = 'fromBucket,toBucket Parameter is required. path must be a folder';
        res.status(404);
    }

    res.send(message);
};
