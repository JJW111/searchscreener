module.exports = function parse(parameter) {
    var param = '';
    for (var key in parameter) {
        param += `&${key}=${parameter[key]}`;
    }
    return param;
}
