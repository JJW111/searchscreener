'use strict'

var path = require('path');



var root = path.dirname(require.main.filename);
var viewPath = root + '/views';



module.exports = {
    root,
    viewPath
}