const { validateJson } = require('../lib/validate');

const storage = require('./util/storage');

function get(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            var docData = {};
            docData.basic = {};

            var data = await storage.file(fileName).download();
            var d = null;
            if (typeof data[0] !== 'string') {
                d = data[0].toString();
            } else {
                d = data;
            }

            var json = JSON.parse(d);
            var row = validateJson(json);

            docData.basic[`companyName`] = row.companyName;
            docData.basic[`companyNameUpper`] = row.companyName && row.companyName.toUpperCase() || null;
            docData.basic[`sector`] = row.sector;
            docData.basic[`industry`] = row.industry;
            docData.basic[`exchange`] = row.exchange;
            docData.basic[`type`] = row.type;

            var exch = row.exchange;

            switch (row.exchange) {
                case 'New York Stock Exchange':
                    exch = 'NYSE';
                    break;
                case 'NYSE Arca':
                    exch = 'ARCA';
                    break;
                case 'NASDAQ':
                    exch = "NAS";
                    break;
                case 'NYSE American':
                    exch = "AMEX";
                    break;
                case 'Cboe BZX US Equities Exchange':
                    exch = "CBOE";
                    break;
                case 'IEX':
                    exch = "IEX";
                    break;
                default:
                    break;
            }

            docData.basic['exch'] = exch;

            resolve(docData);
        } catch (err) {
            reject(err);
        }
    });
}


module.exports = {
    get
}