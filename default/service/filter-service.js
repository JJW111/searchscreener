const { TABLEMAP, STRING_LIST } = require('./global');

function getFilterList(query) {
    var filterList = [];

    for (var key in query) {
        var lkey = key.toLowerCase();

        if (!TABLEMAP[lkey]) continue;

        if (STRING_LIST.includes(lkey)) {
            var filterArr = query[key].split(',');
            filterArr.forEach((item) => {
                filterList.push(`${lkey}=${item}`);
            });
        }
        else {
            filterList.push(`${lkey}=${query[key]}`);
        }
    }
    return filterList;
}



module.exports = {
    getFilterList
}