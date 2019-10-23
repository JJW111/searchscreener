const service = require('./service/reload-service');

const token = process.env.TOKEN;



exports.reload = async (req, res) => {
    var _token = req.query.token;
    var message = '';

    if (!token || token !== _token) {
        res.status(403).end();
        return;
    }

    var path = req.query.path;
    var bucket = req.query.bucket;
    var isFolder = req.query.isFolder || false;

    if (bucket && path) {
        try {
            if (isFolder) {
                var data = await service.reloadAll(bucket, path);
                message = `${bucket}/${path} folder reload all complete. count/failed/total: ${data.count}/${data.failed}/${data.total}</br>
                <h3>Reload List</h3>
                ${data.list.join('</br>').toString()}`;
            }
            else {
                await service.reload(bucket, path);
                message = `${bucket}/${path} reload complete.`;
            }

            res.status(200);
        } catch (err) {
            res.status(500);
            message = err.message || err;
        }
    } else {
        message = 'bucket or path is empty';
        res.status(404);
    }

    res.send(message);
};
