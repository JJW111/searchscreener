'use strict'

function getDateOfMonth(date, add) {
    var d = new Date(date);
    var month = d.getMonth();
    d.setMonth(month + add);
    return d;
}




module.exports = {
    getDateOfMonth,
    
}