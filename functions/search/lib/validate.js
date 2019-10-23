function valueOrNull(v) {
    return v !== undefined && v !== 'null' && v !== null && v !== "" && v !== 'Infinity' ? v : null;
}

function validateJson(json) {
    var result = {};

    for (var i in json) {
        result[i] = valueOrNull(json[i]);
    }

    return result;
}

function validateDateFormat(d) {
    return isNaN(Date.parse(d)) ? null : d;
}


module.exports = {
    valueOrNull,
    validateJson,
    validateDateFormat
}